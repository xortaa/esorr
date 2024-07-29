import EducationalBackgroundOrganizations from "@/models/educational-background-organization";
import { EducationalBackgroundOrganization, EducationalBackgroundOrganizationInput } from "@/types";
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

export const POST = async (req: NextRequest) => {
  await dbConnect();

  let educationalBackgroundOrganizationInput: EducationalBackgroundOrganizationInput;
  try {
    educationalBackgroundOrganizationInput = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    const newEducationalBackgroundOrganization = await EducationalBackgroundOrganizations.create(
      educationalBackgroundOrganizationInput
    );
    return NextResponse.json(newEducationalBackgroundOrganization, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
