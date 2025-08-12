import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig, DefaultSession } from "next-auth";
import { LoginSchema } from "./schemas/LoginSchema";
import { getUserByEmail } from "./lib/user";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";

// Extend the Session and User types to include id and role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: string;
  }
}

export default {
  providers: [
    Github,
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = await validateFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user?.password) return null;

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) return user;
        }
        return null;
      },
    }),
  ],

  // expand session object
  callbacks: {
    async jwt({ token, user }) {
      if (!user) return token;
      token.id = user.id as string;
      token.role = user.role as string;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
