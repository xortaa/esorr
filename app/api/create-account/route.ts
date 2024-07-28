import dbConnect from "@/db/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// @desc Get all users
// @route GET /api/create-account
// @access Private
export const GET = async () => {
  await dbConnect();
  try {
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

// @desc Create a new user
// @route POST /api/create-account
// @access Private
// @req body { email, password }
export const POST = async (req: NextRequest) => {
  await dbConnect();

  const { email, password } = await req.json();
  const user = await User.create({
    email,
    password: bcrypt.hashSync(password, 10),
  });

  if (!user) {
    return NextResponse.json({ message: "User not created" }, { status: 400 });
  }

  return NextResponse.json(user, { status: 201 });
};
