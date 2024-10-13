import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

interface UserInput {
  email: string;
  role: string;
  position: string;
  requestedBy: string;
  affiliation?: string;
}

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const users = await Users.find({ isArchived: false, role: { $ne: "OSA" } }).populate({
      path: "positions.organization",
      select: "name",
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occured" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await connectToDatabase();

  const userInput: UserInput = await req.json();

  try {
    const user = await Users.create({
      email: userInput.email,
      role: userInput.role,
      position: userInput.role === "SOCC" || userInput.role === "RSO" ? "CENTRAL EMAIL" : "",
      requestedBy: userInput.requestedBy,
      affiliation: userInput.affiliation,
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
