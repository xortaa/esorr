import EducationalBackgrounds from "@/models/educational-background";
import { NextRequest, NextResponse } from "next/server";
import { EducationalBackground, EducationalBackgroundInput } from "@/types";
import Members from "@/models/member";
import connectToDatabase from "@/utils/mongodb";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; memberId: string } }) => {
  await connectToDatabase();

  try {
    const educationalBackgrounds = await EducationalBackgrounds.find({ member: params.memberId });
    return NextResponse.json(educationalBackgrounds, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { organizationId: string; memberId: string } }) => {
  await connectToDatabase();

  const educationalBackgroundInput: EducationalBackgroundInput = await req.json();

  try {
    const newEducationalBackground = await EducationalBackgrounds.create({
      ...educationalBackgroundInput,
      member: params.memberId,
    });
    await Members.findByIdAndUpdate(params.memberId, {
      $push: { educational_background: newEducationalBackground._id },
    });
    return NextResponse.json(newEducationalBackground, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
