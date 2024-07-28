import { SocialsInput, Socials } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import Social from "@/models/social";
import dbConnect from "@/db/mongodb";

export const GET = async () => {
  await dbConnect();
  try {
    const socials: Socials[] = await Social.find({});
    return NextResponse.json(socials, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

// @desc create a social
// @route POST /api/socials
// @access Private
// @req body { platform, link }
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { platform, link }: SocialsInput = await req.json();
    const social = await Social.create({ platform, link });
    return NextResponse.json(social, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
