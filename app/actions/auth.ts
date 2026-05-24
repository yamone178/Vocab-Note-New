// app/actions/auth.ts
"use server";
import { prisma } from "@/common/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const proficiencyMap = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
} as const;

export async function signUpAction(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return { error: "User already exists with this email." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        proficiencyLevel: proficiencyMap[data.proficiency as keyof typeof proficiencyMap],
        categories: {
          create: [
            { name: "General" }
          ]
        }
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred during signup." };
  }
}

