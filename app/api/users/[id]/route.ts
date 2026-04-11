import { prisma } from "@/common/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        proficiencyLevel: true,
        xp: true,
        createdAt: true,
        image: true, // Include image
        dailyGoal: true, // Include dailyGoal
        currentDailyWordsLearned: true, // Include currentDailyWordsLearned
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      image: user.image || null, // Ensure image is not undefined
      dailyGoal: user.dailyGoal || 5, // Provide fallback for dailyGoal
      currentDailyWordsLearned: user.currentDailyWordsLearned || 0, // Provide fallback
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
