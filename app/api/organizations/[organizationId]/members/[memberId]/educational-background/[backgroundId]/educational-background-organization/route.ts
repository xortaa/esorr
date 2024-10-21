import EducationalBackgroundOrganizations from "@/models/educational-background-organization";
import { EducationalBackgroundOrganization, EducationalBackgroundOrganizationInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import EducationalBackgrounds from "@/models/educational-background";

export const GET = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; memberId: string; backgroundId: string } }
) => {
  await connectToDatabase();

  try {
    const educationalBackgroundOrganizations: EducationalBackgroundOrganization[] =
      await EducationalBackgroundOrganizations.find({ educational_background: params.backgroundId });
    return NextResponse.json(educationalBackgroundOrganizations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; memberId: string; backgroundId: string } }
) => {
  await connectToDatabase();

  const educationalBackgroundOrganizationInput: EducationalBackgroundOrganizationInput = await req.json();

  try {
    const newEducationalBackgroundOrganization = await EducationalBackgroundOrganizations.create({
      ...educationalBackgroundOrganizationInput,
      educational_background: params.backgroundId,
    });
    await EducationalBackgrounds.findByIdAndUpdate(params.backgroundId, {
      $push: { organizations: newEducationalBackgroundOrganization._id },
    });
    return NextResponse.json(newEducationalBackgroundOrganization, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
