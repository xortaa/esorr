import Organizations from "@/models/organization";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const organization = await Organizations.findById(params.organizationId).select(
      "name logo signatories affiliation officialEmail facebook isWithCentralOrganization isReligiousOrganization levelOfRecognition"
    );
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  const organizationInput = await req.json();

  try {
    const updatedOrganization = await Organizations.findByIdAndUpdate(params.organizationId, organizationInput, {
      new: true,
    });
    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
