import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/db/mongodb";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const users = await Users.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occured" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await connectToDatabase();

  // const { email, password } = await req.json();
  const userInput = await req.json();

  try {
    const user = await Users.create({
      ...userInput,
      password: bcrypt.hashSync(userInput.password, 10),
    });

    if (!user) {
      return NextResponse.json({ message: "User not created" }, { status: 400 });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occured" }, { status: 500 });
  }
};
