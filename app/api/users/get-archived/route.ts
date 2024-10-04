import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const users = await Users.find({ isArchived: true });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occured" }, { status: 500 });
  }
};
