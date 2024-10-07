import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/utils/mongodb";
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
      isSetup: boolean;
    } & DefaultSession["user"];
  }
  export interface Account {
    role: string;
    _id: string;
    isSetup: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    _id: string;
    isSetup: boolean;
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
        password: { label: "Password", type: "password", placeholder: "Enter password" },
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
    async signIn({ user, account, profile, email }) {
      try {
        await dbConnect();

        const existingUser = await User.findOne({ email: profile.email, isArchived: false });

        if (!existingUser && profile.email == process.env.OSA_EMAIL) {
          const newUser = new User({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            role: "OSA",
            isSetup: false, // Initialize isSetup for new users
          });
          await newUser.save();
          account._id = newUser._id.toString();
          account.role = newUser.role;
          account.isSetup = newUser.isSetup;
          return true;
        }

        if (existingUser) {
          if (!existingUser.image) {
            await User.findOneAndUpdate({ email: profile.email }, { image: profile.picture }, { new: true });
          }
          account._id = existingUser._id.toString();
          account.role = existingUser.role;
          account.isSetup = existingUser.isSetup;
          return true;
        }
      } catch (error) {
        console.error("Error signing in", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token._id) {
        session.user._id = token._id.toString();
      }
      session.user.role = token.role;
      session.user.isSetup = token.isSetup;
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.role = account.role;
        token._id = account._id;
        token.isSetup = account.isSetup;
      } else if (user) {
        token.role = (user as any).role;
        token._id = (user as any)._id.toString();
        token.isSetup = (user as any).isSetup;
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