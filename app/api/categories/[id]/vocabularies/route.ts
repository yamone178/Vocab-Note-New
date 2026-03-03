import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const vocabularies = await db.vocabulary.findMany({
      where: {
        categoryId: id,
        word: {
          contains: search,
          mode: "insensitive",
        },
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
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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
      where: { id: session.user.id },
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
        userId: session.user.id,
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
