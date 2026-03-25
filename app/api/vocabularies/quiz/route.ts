import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function GET(req: Request) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");

  try {
    // 1. Fetch vocabularies for the quiz
    let allVocab;
    
    if (mode === "due") {
      // Fetch only due vocabularies
      const now = new Date();
      allVocab = await db.vocabulary.findMany({
        where: { 
          userId,
          isMastered: false,
          nextReview: {
            lte: now
          }
        },
        select: {
          id: true,
          word: true,
          definition: true,
        },
      });

      // If not enough due words, fallback or notify
      if (allVocab.length < 4) {
        return NextResponse.json({ data: [] });
      }
    } else {
      // Default: Fetch all vocabularies
      allVocab = await db.vocabulary.findMany({
        where: { userId },
        select: {
          id: true,
          word: true,
          definition: true,
        },
      });
    }

    if (allVocab.length < 4) {
      return NextResponse.json(
        { message: "You need at least 4 vocabulary words to start a quiz." },
        { status: 400 }
      );
    }

    // Shuffle and pick 10 words for questions
    const shuffled = [...allVocab].sort(() => 0.5 - Math.random());
    const quizWords = shuffled.slice(0, Math.min(10, shuffled.length));

    // 2. Generate questions
    const questions = quizWords.map((vocab) => {
      // Get 3 random definitions from other words as distractors
      const distractors = allVocab
        .filter((v) => v.id !== vocab.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((v) => v.definition);

      // Combine and shuffle options
      const options = [vocab.definition, ...distractors].sort(() => 0.5 - Math.random());

      return {
        id: vocab.id,
        word: vocab.word,
        correctAnswer: vocab.definition,
        options,
      };
    });

    return NextResponse.json({ data: questions });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { message: "Error generating quiz", error },
      { status: 500 }
    );
  }
}
