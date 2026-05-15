import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const difficulty = searchParams.get("difficulty");
  const knowIt = searchParams.get("knowIt");

  try {
    const vocabularies = await db.vocabulary.findMany({
      where: {
        categoryId: id,
        ...(search ? {
          OR: [
            { word: { contains: search, mode: "insensitive" } },
            { definition: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
        ...(difficulty ? { difficulty } : {}),
        ...(knowIt !== null && knowIt !== undefined ? { knowIt: knowIt === "true" } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const category = await db.category.findUnique({
        where: {
            id: id,
        },
        select: {
            name: true,
            _count: {
                select: {
                    vocabularies: true,
                },
            },
        },
    });


    return NextResponse.json({
      data: vocabularies,
      category,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching vocabularies", error },
      { status: 500 }
    );
  }
}

export async function POST(
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
    console.log("POST /api/categories/[id]/vocabularies body:", body);
    const {
      word,
      partOfSpeech,
      definition,
      example,
      synonyms,
      antonyms,
      difficulty,
    } = body;

    // Verify user exists in database
    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "User not found. Please log in again." },
        { status: 401 }
      );
    }

    const vocabulary = await db.vocabulary.create({
      data: {
        word: String(word),
        partOfSpeech: String(partOfSpeech),
        definition: String(definition),
        example: example ? String(example) : null,
        difficulty: difficulty || "BEGINNER",
        synonyms:
          Array.isArray(synonyms)
            ? synonyms
            : typeof synonyms === "string" && synonyms.trim() !== ""
              ? synonyms.split(",").map((s: string) => s.trim())
              : [],
        antonyms:
          Array.isArray(antonyms)
            ? antonyms
            : typeof antonyms === "string" && antonyms.trim() !== ""
              ? antonyms.split(",").map((a: string) => a.trim())
              : [],
        categoryId: String(id),
        userId,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // First review in 1 day
        interval: 1,
      },
    });

    return NextResponse.json(vocabulary, { status: 201 });
  } catch (error) {
    console.error("Error creating vocabulary:", error);
    return NextResponse.json(
      { message: "Error creating vocabulary", error },
      { status: 500 }
    );
  }
}
