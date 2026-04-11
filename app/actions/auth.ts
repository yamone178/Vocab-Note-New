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
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      // proficiencyLevel: proficiencyMap[data.proficiency as keyof typeof proficiencyMap], // Temporarily commented out for debugging
      categories: {
        create: [
          { name: "General" }
        ]
      }
    },
  });

  revalidatePath("/");
  return user;
}
