import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";
import { vocabularySchema } from "@/features/vocabularies/schemas/vocabulary-schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const vocabulary = await db.vocabulary.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      }
    });

    if (!vocabulary) {
      return NextResponse.json({ message: "Vocabulary not found" }, { status: 404 });
    }

    if (vocabulary.userId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ data: vocabulary });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching vocabulary", error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const result = vocabularySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.issues },
        { status: 400 }
      );
    }

    const vocabulary = await db.vocabulary.findUnique({
      where: {
        id,
      },
    });

    if (!vocabulary) {
      return NextResponse.json({ message: "Vocabulary not found" }, { status: 404 });
    }

    if (vocabulary.userId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Process comma-separated strings to string[]
    const synonymsArray = result.data.synonyms
      ? result.data.synonyms.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "")
      : [];
    const antonymsArray = result.data.antonyms
      ? result.data.antonyms.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "")
      : [];

    const updatedVocabulary = await db.vocabulary.update({
      where: {
        id,
      },
      data: {
        word: result.data.word,
        partOfSpeech: result.data.partOfSpeech,
        definition: result.data.definition,
        difficulty: result.data.difficulty,
        example: result.data.example,
        synonyms: synonymsArray,
        antonyms: antonymsArray,
        categoryId: result.data.categoryId,
      },
    });

    return NextResponse.json({ data: updatedVocabulary, message: "Vocabulary updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating vocabulary", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if the vocabulary belongs to the user
    const vocabulary = await db.vocabulary.findUnique({
      where: {
        id,
      },
    });

    if (!vocabulary) {
      return NextResponse.json({ message: "Vocabulary not found" }, { status: 404 });
    }

    if (vocabulary.userId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.vocabulary.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Vocabulary deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting vocabulary", error },
      { status: 500 }
    );
  }
}
