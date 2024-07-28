import { Socials, SocialsInput } from "@/types";
import dbConnect from "@/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Social from "@/models/social";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const id = params.id;
  try {
    const social: Socials = await Social.findById(id);
    return NextResponse.json(social, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const id = params.id;
  const { platform, link }: SocialsInput = await req.json();
  try {
    const updatedSocial = await Social.findByIdAndUpdate(id, { platform, link }, { new: true });
    return NextResponse.json(updatedSocial, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const id = params.id;
  try {
    const deletedSocial = await Social.findByIdAndDelete(id);
    return NextResponse.json(deletedSocial, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
