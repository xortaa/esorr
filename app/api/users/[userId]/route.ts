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

export const PUT = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  await connectToDatabase();

  const body = await req.json();
  const { email, role, fullName, affiliation, positions } = body;

  // Validate input
  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
  }

  const updateData: any = {
    ...(await Users.findById(params.userId).lean()),
    email,
    role,
    fullName,
    affiliation,
    positions: [],
  };

  if (role === "RSO-SIGNATORY" && Array.isArray(positions)) {
    updateData.positions = positions.map((pos) => ({
      organization: pos.organization,
      position: pos.position,
    }));
  } else if (role !== "RSO-SIGNATORY") {
    updateData.positions = [];
  }

  try {
    const updatedUser = await Users.findByIdAndUpdate(params.userId, updateData, { new: true, runValidators: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  await connectToDatabase();

  try {
    const user = await Users.findByIdAndUpdate(params.userId, { isArchived: false }, { new: true });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error unarchiving user:", error);
    return NextResponse.json({ error: "Error unarchiving user" }, { status: 500 });
  }
};
