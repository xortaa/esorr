import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { encode, decode } from "next-auth/jwt";

declare module "next-auth" {
  interface Profile {
    picture?: string;
  }
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { access_type: "offline", prompt: "consent" },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter email" },
        password: { label: "Password", type: "enter", placeholder: "Enter password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials) return null;

        await dbConnect();

        const userFound = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (userFound) {
          const passwordMatch = await bcrypt.compare(credentials!.password, userFound.password);
          if (!passwordMatch) throw new Error("Invalid Password");
          return userFound;
        } else {
          throw new Error("Invalid Email");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await dbConnect();

        if (credentials) {
          return true;
        }

        const existingUser = await User.findOne({ email: profile.email });

        if (existingUser) {
          if (!existingUser.image) {
            await User.findOneAndUpdate({ email: profile.email }, { image: profile.picture }, { new: true });

            return true;
          }
          console.log(profile);
          return true;
        }
      } catch (error) {
        console.error("Error signing in", error);
        return false;
      }
    },
    async session({ session, user, token }) {
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";
    },
  },
  session: { strategy: "jwt" },
  jwt: { encode, decode },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};
