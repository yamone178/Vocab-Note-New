import { prisma } from "@/common/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            proficiencyLevel: true,
            createdAt: true,
        }
    });
    return NextResponse.json(users);
}