import { NextRequest, NextResponse } from "next/server";
import { EducationalBackground, EducationalBackgroundInput } from "@/types";
import EducationalBackgrounds from "@/models/educational-background";
import dbConnect from "@/db/mongodb";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  try {
    const educationalBackground: EducationalBackground = await EducationalBackgrounds.findById(params.id).populate(
      "organizations"
    );
    return NextResponse.json(educationalBackground, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const id = params.id;

  let educationalBackgroundInput: EducationalBackgroundInput;

  try {
    educationalBackgroundInput = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    const educationalBackground = await EducationalBackgrounds.findByIdAndUpdate(id, educationalBackgroundInput, {
      new: true,
    });

    return NextResponse.json(educationalBackground, { status: 200 });
  } catch (error) {
    console.error("Error updating educational background:", error);
    return NextResponse.json({ message: "Error updating data" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  try {
    const deletedEducationalBackground = await EducationalBackgrounds.findByIdAndDelete(params.id);
    return NextResponse.json(deletedEducationalBackground, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
