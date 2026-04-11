import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma } from "@/common/lib/prisma";
import { z } from "zod";

const interactionSchema = z.object({
  vocabularyWord: z.string().min(1),
  interactionType: z.enum(["VIEW", "SAVE", "MASTERED"]),
  weight: z.number().optional().default(1.0),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = interactionSchema.parse(body);

    const interaction = await prisma.userInteraction.upsert({
      where: {
        userId_vocabularyWord_interactionType: {
          userId: userId,
          vocabularyWord: validatedData.vocabularyWord,
          interactionType: validatedData.interactionType,
        },
      },
      update: {
        weight: { increment: validatedData.weight },
      },
      create: {
        userId: userId,
        vocabularyWord: validatedData.vocabularyWord,
        interactionType: validatedData.interactionType,
        weight: validatedData.weight,
      },
    });

    return NextResponse.json(interaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Interaction save error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
