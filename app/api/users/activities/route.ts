import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma } from "@/common/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentVocabs = await prisma.vocabulary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true }
    });

    const recentInteractions = await prisma.userInteraction.findMany({
      where: { userId, interactionType: "REVIEW" }, // assuming REVIEW is tracked, otherwise just MASTERED, etc.
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    // We can map these into a unified list of activities
    let activities: { text: string; createdAt: Date }[] = [];

    recentVocabs.forEach(v => {
      activities.push({
        text: `Added new word '${v.word}' to '${v.category.name}'`,
        createdAt: v.createdAt
      });
    });

    recentInteractions.forEach(i => {
      activities.push({
        text: `Interacted with '${i.vocabularyWord}' (${i.interactionType})`,
        createdAt: i.updatedAt
      });
    });

    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Fallback if empty
    if (activities.length === 0) {
      activities = [
        { text: "Welcome to VocabNote!", createdAt: new Date() }
      ];
    }

    return NextResponse.json({ data: activities.slice(0, 5) });
  } catch (error) {
    console.error("Activities fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
