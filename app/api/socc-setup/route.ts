import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const data = await req.json();
    const { email, fullName, prefix, suffix, position } = data;

    if (!email || !fullName || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        fullName,
        $push: {
          positions: {
            position: position,
            affiliation: "SOCC",
          },
        },
        isSetup: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "An error occurred while updating the user" }, { status: 500 });
  }
}
