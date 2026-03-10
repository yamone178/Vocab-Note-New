import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

// Helper to handle CORS
function corsResponse(req: Request, response: NextResponse) {
  const origin = req.headers.get("origin") || "*";
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export async function OPTIONS(req: Request) {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(req, response);
}

export async function GET(req: Request) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return corsResponse(req, NextResponse.json({ message: "Unauthorized" }, { status: 401 }));
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const difficulty = searchParams.get("difficulty");
  const knowIt = searchParams.get("knowIt");
  const skip = (page - 1) * limit;

  try {
    const where = {
      userId,
      ...(search ? {
        OR: [
          { word: { contains: search, mode: "insensitive" } },
          { definition: { contains: search, mode: "insensitive" } },
        ],
      } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(knowIt !== null && knowIt !== undefined ? { knowIt: knowIt === "true" } : {}),
    };

    const [vocabularies, total] = await Promise.all([
      db.vocabulary.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
        },
      }),
      db.vocabulary.count({ where: where as any }),
    ]);

    return corsResponse(req, NextResponse.json({
      data: vocabularies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }));
  } catch (error) {
    console.error("Error fetching vocabularies:", error);
    return corsResponse(req, NextResponse.json(
      { message: "Error fetching vocabularies", error },
      { status: 500 }
    ));
  }
}

export async function POST(req: Request) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return corsResponse(req, NextResponse.json({ message: "Unauthorized" }, { status: 401 }));
  }

  try {
    const body = await req.json();
    const { word, definition, partOfSpeech, example, difficulty } = body;
    let { categoryId } = body;

    if (!word) {
      return corsResponse(req, NextResponse.json(
        { message: "Word is required" },
        { status: 400 }
      ));
    }

    // If categoryId is not provided, find or create a "General" category for the user
    if (!categoryId) {
      let defaultCategory = await db.category.findFirst({
        where: {
          name: "General",
          userId,
        },
      });

      if (!defaultCategory) {
        defaultCategory = await db.category.create({
          data: {
            name: "General",
            userId,
            description: "Default category for quick saves",
          },
        });
      }
      categoryId = defaultCategory.id;
    }

    // Set initial review to 1 day after creation (FR1)
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    const vocabulary = await db.vocabulary.create({
      data: {
        word,
        categoryId,
        userId,
        definition: definition || "",
        partOfSpeech: partOfSpeech || "noun",
        example: example || "",
        difficulty: difficulty || "BEGINNER",
        nextReview,
        interval: 1,
      },
    });

    return corsResponse(req, NextResponse.json(vocabulary, { status: 201 }));
  } catch (error) {
    console.error("Error creating vocabulary:", error);
    return corsResponse(req, NextResponse.json(
      { message: "Error creating vocabulary", error },
      { status: 500 }
    ));
  }
}
