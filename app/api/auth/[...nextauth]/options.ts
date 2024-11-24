import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/utils/mongodb";
import User from "@/models/user";
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
      organization: string;
    } & DefaultSession["user"];
  }

  export interface Account {
    role: string;
    _id: string;
    isSetup: boolean;
    organization: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    _id: string;
    isSetup: boolean;
    organization: string;
  }
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { access_type: "offline", prompt: "consent" },
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
            isSetup: false,
          });
          await newUser.save();
          account._id = newUser._id.toString();
          account.role = newUser.role;
          account.isSetup = newUser.isSetup;
          account.organization = newUser.organization ? newUser.organization.toString() : "";
          return true;
        }

        if (existingUser) {
          if (!existingUser.image) {
            await User.findOneAndUpdate({ email: profile.email }, { image: profile.picture }, { new: true });
          }
          account._id = existingUser._id.toString();
          account.role = existingUser.role;
          account.isSetup = existingUser.isSetup;
          account.organization = existingUser.organization ? existingUser.organization.toString() : "";
          return true;
        }

        return false; // Deny sign in if user doesn't exist and is not OSA email
      } catch (error) {
        console.error("Error signing in", error);
        return false;
      }
    },
    async session({ session, token }) {
      await dbConnect();

      if (token._id) {
        session.user._id = token._id.toString();
      }
      session.user.role = token.role;
      session.user.isSetup = token.isSetup;
      session.user.organization = token.organization;

      console.log("Session:", session);

      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.role = account.role;
        token._id = account._id;
        token.isSetup = account.isSetup;
        token.organization = account.organization;
      } else if (user) {
        const dbUser = await User.findById((user as any)._id);
        if (dbUser) {
          token.role = dbUser.role;
          token._id = dbUser._id.toString();
          token.isSetup = dbUser.isSetup;
          token.organization = dbUser.organization ? dbUser.organization.toString() : "";
        }
      }

      console.log("JWT Token:", token);

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
