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
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  try {
    const where = {
      userId: session.user.id,
      ...(search ? {
        OR: [
          { word: { contains: search, mode: "insensitive" } },
          { definition: { contains: search, mode: "insensitive" } },
        ],
      } : {}),
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

    return NextResponse.json({
      data: vocabularies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching vocabularies:", error);
    return NextResponse.json(
      { message: "Error fetching vocabularies", error },
      { status: 500 }
    );
  }
}
