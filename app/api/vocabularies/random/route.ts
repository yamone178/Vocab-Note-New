import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function GET(req: Request) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const count = parseInt(searchParams.get("count") || "7");

  try {
    // Get random vocabularies using raw SQL for better performance on large datasets
    // or use a more Prisma-friendly way for smaller datasets
    const totalVocab = await db.vocabulary.count({
      where: { userId }
    });

    if (totalVocab === 0) {
      return NextResponse.json({ data: [] });
    }

    // A simple way to get random records: 
    // Get all IDs, shuffle them, take N, then fetch those records.
    // For simplicity and assuming modest scale:
    const allVocab = await db.vocabulary.findMany({
      where: { userId },
      select: { id: true }
    });

    const shuffled = allVocab.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, count).map(v => v.id);

    const vocabularies = await db.vocabulary.findMany({
      where: {
        id: { in: selectedIds }
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({
      data: vocabularies
    });
  } catch (error) {
    console.error("Error fetching random vocabularies:", error);
    return NextResponse.json(
      { message: "Error fetching vocabularies", error },
      { status: 500 }
    );
  }
}
