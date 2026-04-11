import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma } from "@/common/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get current user's vocabularies and interactions
    const userVocabs = await prisma.vocabulary.findMany({
      where: { userId },
      select: { word: true },
    });
    
    const userInteractions = await prisma.userInteraction.findMany({
      where: { userId },
      select: { vocabularyWord: true },
    });

    const userWordSet = new Set([
      ...userVocabs.map(v => v.word.toLowerCase()),
      ...userInteractions.map(i => i.vocabularyWord.toLowerCase())
    ]);

    // 2. Build items from all other users
    // In a real system, we'd limit this or use a background job
    const allOtherVocabs = await prisma.vocabulary.findMany({
      where: {
        userId: { not: userId }
      },
      select: {
        word: true,
        definition: true,
        example: true,
        userId: true,
      }
    });

    // 3. Simple Collaborative Filtering (Find similar users)
    const otherUserVocabs: Record<string, Set<string>> = {};
    const wordDetails: Record<string, { word: string; definition: string; example: string | null; count: number }> = {};

    allOtherVocabs.forEach(v => {
      const lowerWord = v.word.toLowerCase();
      
      if (!otherUserVocabs[v.userId]) {
        otherUserVocabs[v.userId] = new Set();
      }
      otherUserVocabs[v.userId].add(lowerWord);

      if (!wordDetails[lowerWord]) {
        wordDetails[lowerWord] = { word: v.word, definition: v.definition, example: v.example, count: 0 };
      }
      wordDetails[lowerWord].count++;
    });

    const userSimilarities = Object.entries(otherUserVocabs).map(([otherId, otherWords]) => {
      const intersection = [...userWordSet].filter(x => otherWords.has(x)).length;
      const union = new Set([...userWordSet, ...otherWords]).size;
      const jaccard = union === 0 ? 0 : intersection / union;
      return { userId: otherId, score: jaccard };
    });

    // Sort by similarity descending
    userSimilarities.sort((a, b) => b.score - a.score);

    // 4. Extract new vocabularies from similar users
    const recommendations = new Map<string, number>();

    // Weight words by the similarity of the user who has them + global popularity
    for (const sim of userSimilarities) {
      if (sim.score === 0 && userWordSet.size > 0) continue; // If we have data, only use similar users. If no data, fallback to popular.
      
      const otherWords = otherUserVocabs[sim.userId];
      for (const word of otherWords) {
        if (!userWordSet.has(word)) {
          const currentScore = recommendations.get(word) || 0;
          // Score = user similarity + small bonus for popularity among others
          recommendations.set(word, currentScore + sim.score + 0.1); 
        }
      }
    }

    // Fallback to most popular if no similarities
    if (recommendations.size === 0) {
      for (const [word, details] of Object.entries(wordDetails)) {
        if (!userWordSet.has(word)) {
          recommendations.set(word, details.count);
        }
      }
    }

    // Sort recommended words by score
    const sortedRecommendations = [...recommendations.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Recommend 3-5 words
      .map(([word]) => wordDetails[word]);

    // Format output
    return NextResponse.json(sortedRecommendations.map(r => ({
      word: r.word,
      meaning: r.definition,
      example: r.example || "",
    })));

  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
