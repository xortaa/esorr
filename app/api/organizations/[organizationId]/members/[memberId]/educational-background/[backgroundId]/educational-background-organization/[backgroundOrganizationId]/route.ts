import EducationalBackgroundOrganizations from "@/models/educational-background-organization";
import { EducationalBackgroundOrganization, EducationalBackgroundOrganizationInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";
import EducationalBackgrounds from "@/models/educational-background";

interface IParams {
  organizationId: string;
  memberId: string;
  backgroundId: string;
  backgroundOrganizationId: string;
}

export const GET = async (req: NextRequest, { params }: { params: IParams }) => {
  await connectToDatabase();

  try {
    const educationalBackgroundOrganization: EducationalBackgroundOrganization =
      await EducationalBackgroundOrganizations.findById(params.backgroundOrganizationId);
    return NextResponse.json(educationalBackgroundOrganization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: IParams }) => {
  await connectToDatabase();

  const educationalBackgroundOrganizationInput: EducationalBackgroundOrganizationInput = await req.json();

  try {
    const updatedEducationalBackgroundOrganization = await EducationalBackgroundOrganizations.findByIdAndUpdate(
      params.backgroundOrganizationId,
      educationalBackgroundOrganizationInput,
      { new: true }
    );
    return NextResponse.json(updatedEducationalBackgroundOrganization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: IParams }) => {
  await connectToDatabase();

  try {
    const deletedEducationalBackgroundOrganization = await EducationalBackgroundOrganizations.findByIdAndDelete(
      params.backgroundOrganizationId
    );
    await EducationalBackgrounds.findByIdAndUpdate(params.backgroundId, {
      $pull: { organizations: params.backgroundOrganizationId },
    });
    return NextResponse.json(deletedEducationalBackgroundOrganization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
