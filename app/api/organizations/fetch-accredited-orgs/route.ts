import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organization from "@/models/organization";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    // get all organizations whose academicYear is the same as their academicYearOfLastRecognition
    const accreditedOrgs = await Organization.find({
      $expr: { $eq: ["$academicYear", "$academicYearOfLastRecognition"] },
    })
      .select("name affiliation levelOfRecognition academicYearOfLastRecognition")
      .lean();

    return NextResponse.json(accreditedOrgs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
