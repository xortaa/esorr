import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Event from "@/models/event";

export const GET = async ( req: NextRequest, {params}: {params: {organizationId: string; academicYear: string}}) => { 
  await connectToDatabase();

  try {
    const events = await Event.find({ academicYear: params.academicYear, organization: params.organizationId });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}