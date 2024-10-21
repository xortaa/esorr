import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export const DELETE = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  await connectToDatabase();

  const user = await Users.findByIdAndUpdate(params.userId, { isArchived: true }, { new: true });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
};
