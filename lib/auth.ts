import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/common/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      proficiencyLevel?: string;
      image?: string | null; // Add image property
      xp?: number; // Make xp optional in session user
    };
  }

  interface User {
    proficiencyLevel?: string;
    xp: number; // xp is required from DB
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    proficiencyLevel?: string;
    xp: number; // xp is required in JWT
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log("Attempting to authorize user:", credentials.email);
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            proficiencyLevel: true,
            xp: true, // Explicitly select xp
            password: true, // Need password to compare
          }
        });

        if (!user) {
          console.log("User not found for email:", credentials.email);
          throw new Error("Invalid email or password");
        }

        console.log("User found, comparing passwords...");
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log("Invalid password for user:", credentials.email);
          throw new Error("Invalid email or password");
        }
        console.log("Password is valid. User authorized:", user.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          proficiencyLevel: user.proficiencyLevel,
          xp: user.xp,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.proficiencyLevel = user.proficiencyLevel;
        token.xp = user.xp;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub!;
        session.user.proficiencyLevel = token.proficiencyLevel;
        session.user.xp = token.xp;
      }
      return session;
    },
  },
};