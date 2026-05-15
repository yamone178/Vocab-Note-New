import { prisma } from "@/common/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { xpAmount } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (typeof xpAmount !== "number" || xpAmount === 0) {
    return NextResponse.json({ error: "Invalid XP amount" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        xp: { increment: xpAmount },
      },
      select: {
        id: true,
        xp: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user XP:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
