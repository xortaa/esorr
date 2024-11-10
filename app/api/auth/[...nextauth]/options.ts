import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/utils/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { encode, decode } from "next-auth/jwt";
import { DefaultSession, DefaultUser } from "next-auth";
import Organization from "@/models/organization";

declare module "next-auth" {
  export interface Profile {
    picture?: string;
  }
  export interface Session {
    user: {
      _id: string;
      role: string;
      isSetup: boolean;
      positions?: {
        organization: {
          _id: string;
          name: string;
        };
        position: string;
        _id: string;
      }[];
    } & DefaultSession["user"];
  }

  export interface Account {
    role: string;
    _id: string;
    isSetup: boolean;
    positions?: {
      organization: {
        _id: string;
        name: string;
      };
      position: string;
      _id: string;
    }[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    _id: string;
    isSetup: boolean;
    positions?: {
      organization: {
        _id: string;
        name: string;
      };
      position: string;
      _id: string;
    }[];
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
          if (existingUser.positions) {
            account.positions = existingUser.positions;
          }
          return true;
        }
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
      session.user.positions = token.positions;

      // Populate organization details in positions
      if (session.user.positions) {
        for (const position of session.user.positions) {
          const organization = await Organization.findById(position.organization._id).select("name");
          if (organization) {
            position.organization = {
              _id: organization._id.toString(),
              name: organization.name,
            };
          }
        }
      }

      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.role = account.role;
        token._id = account._id;
        token.isSetup = account.isSetup;
        token.positions = account.positions;
      } else if (user) {
        token.role = (user as any).role;
        token._id = (user as any)._id.toString();
        token.isSetup = (user as any).isSetup;
        token.positions = (user as any).positions;
      }

      // Populate organization details in positions
      if (token.positions) {
        for (const position of token.positions) {
          const organization = await Organization.findById(position.organization).select("name");
          if (organization) {
            position.organization = {
              _id: organization._id.toString(),
              name: organization.name,
            };
          }
        }
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
