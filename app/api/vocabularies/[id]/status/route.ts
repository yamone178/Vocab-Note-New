import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { knowIt } = body;

    const vocabulary = await db.vocabulary.update({
      where: {
        id,
        userId: session.user.id, // Ensure user owns the vocabulary
      },
      data: {
        knowIt,
      },
    });

    return NextResponse.json(vocabulary);
  } catch (error) {
    console.error("Error updating vocabulary status:", error);
    return NextResponse.json(
      { message: "Error updating vocabulary", error },
      { status: 500 }
    );
  }
}
