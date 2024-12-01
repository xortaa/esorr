import Organizations from "@/models/organization";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const academicYear = await Organizations.findById(params.organizationId).select("academicYear");

    return NextResponse.json(academicYear, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};