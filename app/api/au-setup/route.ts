import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const prefix = formData.get("prefix") as string;
    const suffix = formData.get("suffix") as string;
    const firstName = formData.get("firstName") as string;
    const middleName = formData.get("middleName") as string;
    const lastName = formData.get("lastName") as string;
    const position = formData.get("position") as string;
    const email = formData.get("email") as string;

    if (!firstName || !lastName || !position || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        prefix,
        suffix,
        firstName,
        middleName,
        lastName,
        position,
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
