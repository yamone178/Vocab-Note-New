import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const count = parseInt(searchParams.get("count") || "7");

  try {
    // Get random vocabularies using raw SQL for better performance on large datasets
    // or use a more Prisma-friendly way for smaller datasets
    const totalVocab = await db.vocabulary.count({
      where: { userId: session.user.id }
    });

    if (totalVocab === 0) {
      return NextResponse.json({ data: [] });
    }

    // A simple way to get random records: 
    // Get all IDs, shuffle them, take N, then fetch those records.
    // For simplicity and assuming modest scale:
    const allVocab = await db.vocabulary.findMany({
      where: { userId: session.user.id },
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
