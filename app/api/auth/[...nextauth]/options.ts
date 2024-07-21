import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter email" },
        password: { label: "Password", type: "enter", placeholder: "Enter password" },
      },
      async authorize(credentials): Promise<any> {
        await dbConnect();

        const userFound = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!userFound) {
          throw new Error("Invalid Email");
        }

        const passwordMatch = await bcrypt.compare(credentials!.password, userFound.password);

        if (!passwordMatch) throw new Error("Invalid Password");

        return userFound;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await dbConnect();

        const existingUser = await User.findOne({ email: profile.email } || { username: credentials.username });

        return true;
      } catch (error) {
        console.error("Error signing in", error);
        return false;
      }
    },
    async session({ session, user, token }) {
      return session;
    },
  },
};
