import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/common/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if the vocabulary belongs to the user
    const vocabulary = await db.vocabulary.findUnique({
      where: {
        id,
      },
    });

    if (!vocabulary) {
      return NextResponse.json({ message: "Vocabulary not found" }, { status: 404 });
    }

    if (vocabulary.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.vocabulary.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Vocabulary deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting vocabulary", error },
      { status: 500 }
    );
  }
}
