import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { prisma } from "@/common/lib/prisma";
import bcrypt from "bcryptjs";

function corsResponse(req: Request, response: NextResponse) {
  const origin = req.headers.get("origin") || "*";
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export async function OPTIONS(req: Request) {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(req, response);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return corsResponse(req, NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      ));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return corsResponse(req, NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      ));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return corsResponse(req, NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      ));
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return corsResponse(req, NextResponse.json(
        { message: "Server misconfiguration" },
        { status: 500 }
      ));
    }

    const token = await encode({
      token: {
        sub: user.id,
        email: user.email,
        name: user.name,
        proficiencyLevel: user.proficiencyLevel,
        xp: user.xp,
      },
      secret,
      maxAge: 60 * 60 * 24 * 30,
    });

    return corsResponse(req, NextResponse.json({ token }));
  } catch (error) {
    console.error("Extension login error:", error);
    return corsResponse(req, NextResponse.json(
      { message: "Unable to sign in" },
      { status: 500 }
    ));
  }
}
