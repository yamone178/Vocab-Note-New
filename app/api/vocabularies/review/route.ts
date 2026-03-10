import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

// Helper to handle CORS
function corsResponse(req: Request, response: NextResponse) {
  const origin = req.headers.get("origin") || "*";
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
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

  try {
    const now = new Date();

    const dueVocabularies = await db.vocabulary.findMany({
      where: {
        userId,
        isMastered: false,
        nextReview: {
          lte: now,
        },
      },
      orderBy: {
        nextReview: "asc",
      },
      include: {
        category: true,
      },
    });

    return corsResponse(req, NextResponse.json({ data: dueVocabularies }));
  } catch (error) {
    console.error("Error fetching due vocabularies:", error);
    return corsResponse(req, NextResponse.json(
      { message: "Error fetching due vocabularies", error },
      { status: 500 }
    ));
  }
}
