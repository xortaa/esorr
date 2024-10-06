import EducationalBackgrounds from "@/models/educational-background";
import { EducationalBackground, EducationalBackgroundInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import Members from "@/models/member";
import connectToDatabase from "@/utils/mongodb";

interface IParams {
  organizationId: string;
  memberId: string;
  backgroundId: string;
}

export const GET = async (req: NextRequest, { params }: { params: IParams }) => {
  await connectToDatabase();

  try {
    const educationalBackground: EducationalBackground = await EducationalBackgrounds.findById(params.backgroundId);
    return NextResponse.json(educationalBackground, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: IParams }) => {
  await connectToDatabase();

  const educationalBackgroundInput: EducationalBackgroundInput = await req.json();

  try {
    const updatedEducationalBackground = await EducationalBackgrounds.findByIdAndUpdate(
      params.backgroundId,
      educationalBackgroundInput,
      { new: true }
    );
    return NextResponse.json(updatedEducationalBackground, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: IParams }) => {
  await connectToDatabase();

  try {
    const deletedEducationalBackground = await EducationalBackgrounds.findByIdAndDelete(params.backgroundId);
    await Members.findByIdAndUpdate(params.memberId, {
      $pull: { educational_background: params.backgroundId },
    });
    return NextResponse.json(deletedEducationalBackground, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
