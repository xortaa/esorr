import EducationalBackgrounds from "@/models/educational-background";
import { EducationalBackground, EducationalBackgroundInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/mongodb";

export const GET = async () => {
  await dbConnect();
  try {
    const educationalBackgrounds: EducationalBackground[] = await EducationalBackgrounds.find({}).populate(
      "organizations"
    );
    return NextResponse.json(educationalBackgrounds, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await dbConnect();

  let educationalBackgroundInput: EducationalBackgroundInput;

  try {
    educationalBackgroundInput = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    const newEducationalBackground = await EducationalBackgrounds.create(educationalBackgroundInput);
    return NextResponse.json(newEducationalBackground, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
