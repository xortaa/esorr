import Organizations from "@/models/organization";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import { Organization} from "@/types";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const organization: Organization | null = await Organizations.findById(params.organizationId);
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
    const updatedOrganization: Organization = await Organizations.findByIdAndUpdate(
      params.organizationId,
      organizationInput,
      { new: true }
    );
    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const organization: Organization | null = await Organizations.findByIdAndDelete(params.organizationId);
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
