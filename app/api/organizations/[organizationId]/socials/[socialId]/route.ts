import Socials from "@/models/social";
import { Social, SocialInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";
import Organization from "@/models/organization";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; socialId: string } }) => {
  await connectToDatabase();

  try {
    const social: Social = await Socials.findById(params.socialId);
    return NextResponse.json(social, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; socialId: string } }) => {
  await connectToDatabase();

  const socialInput: SocialInput = await req.json();

  try {
    const updatedSocial = await Socials.findByIdAndUpdate(params.socialId, socialInput, { new: true });
    return NextResponse.json(updatedSocial, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; socialId: string } }
) => {
  await connectToDatabase();

  try {
    const deletedSocial = await Socials.findByIdAndDelete(params.socialId);
    await Organization.findByIdAndUpdate(params.organizationId, { $pull: { socials: params.socialId } });
    return NextResponse.json(deletedSocial, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
