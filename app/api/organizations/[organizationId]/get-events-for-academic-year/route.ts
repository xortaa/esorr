import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Event from "@/models/event";
import Organization from "@/models/organization";

export const GET = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; academicYear: string } }
) => {
  await connectToDatabase();

  try {
    const organization = await Organization.findById(params.organizationId).select("academicYear");

    const events = await Event.find({
      academicYear: organization.academicYear,
      organization: organization._id,
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
