import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { encode, decode } from "next-auth/jwt";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  export interface Profile {
    picture?: string;
  }
  export interface Session {
    user: {
      _id: string;
      role: string;
    } & DefaultSession["user"];
  }
  export interface Account {
    role: string;
    _id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
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
          account._id = existingUser._id.toString();
          account.role = existingUser.role;
          return true;
        }
      } catch (error) {
        console.error("Error signing in", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user._id = token._id.toString();
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.role = account.role;
        token._id = account._id;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/login-redirect";
    },
  },
  session: { strategy: "jwt" },
  jwt: { encode, decode },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};
