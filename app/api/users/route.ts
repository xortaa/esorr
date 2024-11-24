import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const users = await Users.find({ isArchived: false });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occured" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await connectToDatabase();

  const userInput = await req.json();

  try {
    let userData: any = {
      email: userInput.email,
      role: userInput.role,
      isArchived: false,
      isSetup: false,
    };

    const user = await Users.create(userData);

    if (!user) {
      return NextResponse.json({ message: "User not created" }, { status: 400 });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occurred" }, { status: 500 });
  }
};
