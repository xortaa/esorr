import { EducationalBackgroundOrganization, EducationalBackgroundOrganizationInput } from "@/types";
import EducationalBackgroundOrganizations from "@/models/educational-background-organization";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/mongodb";

export const GET = async () => {
  await dbConnect();
  try {
    const educationalBackgroundOrganizations: EducationalBackgroundOrganization[] =
      await EducationalBackgroundOrganizations.find({});
    return NextResponse.json(educationalBackgroundOrganizations, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const id = params.id;

  let educationalBackgroundOrganizationInput: EducationalBackgroundOrganizationInput;

  try {
    educationalBackgroundOrganizationInput = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    const educationalBackgroundOrganization = await EducationalBackgroundOrganizations.findByIdAndUpdate(
      id,
      educationalBackgroundOrganizationInput,
      { new: true }
    );

    return NextResponse.json(educationalBackgroundOrganization, { status: 200 });
  } catch (error) {
    console.error("Error updating educational background:", error);
    return NextResponse.json({ message: "Error updating data" }, { status: 500 });
  }
};
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const id = params.id;
  try {
    const deletedEducationalBackgroundOrganization = await EducationalBackgroundOrganizations.findByIdAndDelete(id);
    return NextResponse.json(deletedEducationalBackgroundOrganization, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
