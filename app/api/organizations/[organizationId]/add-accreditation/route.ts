import Organization from "@/models/organization";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  const body = await req.json();

  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(
      params.organizationId,
      {
        isAccredited: true,
        levelOfRecognition: body.accreditationCode,
        academicYearOfLastRecognition: body.yearOfAccreditation,
      },
      {
        new: true,
      }
    );
    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
