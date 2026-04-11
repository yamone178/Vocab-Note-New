import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

// Example interval progression: 1 day → 3 days → 7 days → 14 days → 30 days → 60 days → 120 days → ...
const INTERVAL_PROGRESSION = [1, 3, 7, 14, 30, 60, 120];

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const vocabulary = await db.vocabulary.findUnique({
      where: { id },
    });

    if (!vocabulary) {
      return NextResponse.json({ message: "Vocabulary not found" }, { status: 404 });
    }

    if (vocabulary.userId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { remembered, mastered } = body;

    const updateData: any = {
      lastReview: new Date(),
    };

    if (mastered) {
      updateData.isMastered = true;
    } else if (remembered) {
      // Find current interval index or default to 0
      const currentIndex = INTERVAL_PROGRESSION.indexOf(vocabulary.interval);
      let nextInterval: number;

      if (currentIndex === -1 || currentIndex >= INTERVAL_PROGRESSION.length - 1) {
        // If not in list or at the end, double the interval (FR2: continues indefinitely)
        nextInterval = vocabulary.interval === 0 ? 1 : vocabulary.interval * 2;
      } else {
        nextInterval = INTERVAL_PROGRESSION[currentIndex + 1];
      }

      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + nextInterval);

      updateData.interval = nextInterval;
      updateData.nextReview = nextReview;
    } else {
      // If not remembered, reset interval to 1 day
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + 1);

      updateData.interval = 1;
      updateData.nextReview = nextReview;
    }

    const [updatedVocabulary] = await db.$transaction([
      db.vocabulary.update({
        where: { id },
        data: updateData,
      }),
      db.user.update({
        where: { id: userId },
        data: { xp: { increment: 2 } }, // Add XP for reviewing a flashcard
      }),
    ]);

    return NextResponse.json(updatedVocabulary);
  } catch (error) {
    console.error("Error updating review status:", error);
    return NextResponse.json(
      { message: "Error updating review status", error },
      { status: 500 }
    );
  }
}
