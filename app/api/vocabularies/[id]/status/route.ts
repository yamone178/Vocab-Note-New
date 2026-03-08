import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { knowIt } = body;

    const vocabulary = await db.vocabulary.update({
      where: {
        id,
        userId, // Ensure user owns the vocabulary
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
