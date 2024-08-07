import Socials from "@/models/social";
import { Social, SocialInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";
import Organization from "@/models/organization";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const socials: Social[] = await Socials.find({ organization: params.organizationId });
    return NextResponse.json(socials, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  const socialInput: SocialInput = await req.json();

  try {
    const newSocial = await Socials.create({ ...socialInput, organization: params.organizationId });
    await Organization.findByIdAndUpdate(params.organizationId, { $push: { socials: newSocial._id } });
    return NextResponse.json(newSocial, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};


