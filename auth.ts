import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { authConfig } from "./auth.config";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password";
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidLoginError();
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new InvalidLoginError();
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordsMatch) {
          throw new InvalidLoginError();
        }

        return user;
      },
    }),
  ],
});
