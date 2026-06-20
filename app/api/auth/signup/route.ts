import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/common/lib/prisma"; // Assuming prisma is set up and accessible
import { signupSchema } from "@/features/auth/schema/auth"; // Import the signup schema

// CORS helper function (similar to the one in extension/route.ts)
function corsResponse(req: Request, response: NextResponse) {
  const origin = req.headers.get("origin") || "*";
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: Request) {
  const response = new NextResponse(null, { status: 204 });
  return corsResponse(req, response);
}

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body against the signup schema
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      return corsResponse(
        req,
        NextResponse.json(
          { message: "Validation error", errors: validationResult.error.flatten() },
          { status: 400 }
        )
      );
    }

    const { name, email, password, proficiency } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return corsResponse(
        req,
        NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        proficiencyLevel: proficiency,
        xp: 0, // Default experience points
      },
    });

    // Respond with success, excluding sensitive info like password hash
    return corsResponse(
      req,
      NextResponse.json({ message: "User created successfully", userId: newUser.id }, { status: 201 })
    );
  } catch (error) {
    console.error("Signup API error:", error);
    // Handle potential server errors (e.g., database errors)
    return corsResponse(
      req,
      NextResponse.json({ message: "Failed to create account" }, { status: 500 })
    );
  }
}
