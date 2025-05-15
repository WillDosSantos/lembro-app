import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const raw = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
        const users = JSON.parse(raw);
      
        const user = users.find(
          (u: any) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
      
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email
          };
        }
      
        return null;
      }
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
