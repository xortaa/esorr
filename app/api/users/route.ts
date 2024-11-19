import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import mongoose from "mongoose";
import Organizations from '@/models/organization';

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const users = await Users.find({ isArchived: false }).populate({
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

  const userInput = await req.json();

  try {
    let userData: any = {
      email: userInput.email,
      role: userInput.role,
      position: userInput.role === "SOCC" || userInput.role === "RSO" ? "CENTRAL EMAIL" : "",
      isArchived: false,
      isSetup: false,
    };

    if (userInput.role === "RSO-SIGNATORY" && userInput.positions && userInput.positions.length > 0) {
      const positionsPromises = userInput.positions.map(async (pos: any) => {
        let organizationId;
        if (mongoose.Types.ObjectId.isValid(pos.organization)) {
          organizationId = pos.organization;
        } else {
          const organization = await Organizations.findOne({ name: pos.organization });
          if (!organization) {
            throw new Error(`Organization not found: ${pos.organization}`);
          }
          organizationId = organization._id;
        }
        return {
          organization: organizationId,
          position: pos.position,
        };
      });

      userData.positions = await Promise.all(positionsPromises);
      userData.organizations = userData.positions.map((pos: any) => pos.organization);
    }

    const user = await Users.create(userData);

    if (!user) {
      return NextResponse.json({ message: "User not created" }, { status: 400 });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occurred" }, { status: 500 });
  }}
