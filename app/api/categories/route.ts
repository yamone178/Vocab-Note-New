import { NextResponse } from "next/server";
import { getAuthUserId } from "@/app/api/_utils/auth";
import { prisma as db } from "@/common/lib/prisma";
import { categorySchema } from "@/features/category/schemas/category-schema";

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

export async function POST(req: Request) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return corsResponse(req, NextResponse.json({ message: "Unauthorized" }, { status: 401 }));
  }

  try {
    const body = await req.json();
    const { name, description } = categorySchema.parse(body);

    // Verify user exists in database
    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return corsResponse(req, NextResponse.json(
        { message: "User not found. Please log in again." },
        { status: 401 }
      ));
    }

    const category = await db.category.create({
      data: {
        name,
        description,
        userId,
      },
    });

    return corsResponse(req, NextResponse.json(category, { status: 201 }));
  } catch (error) {
    console.error("Error creating category:", error);
    return corsResponse(req, NextResponse.json(
      { message: "Error creating category", error },
      { status: 500 }
    ));
  }
}

export async function GET(req: Request) {
  const userId = await getAuthUserId(req);

  if (!userId) {
    return corsResponse(req, NextResponse.json({ message: "Unauthorized" }, { status: 401 }));
  }

  try {
    const categories = await db.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return corsResponse(req, NextResponse.json({
      data: categories,
    }));
  } catch (error) {
    return corsResponse(req, NextResponse.json(
      { message: "Error fetching categories", error },
      { status: 500 }
    ));
  }
}
