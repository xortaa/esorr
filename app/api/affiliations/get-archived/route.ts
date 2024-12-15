import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Affiliations from "@/models/affiliation";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const affiliations = await Affiliations.find({ isArchived: true });
    return NextResponse.json(affiliations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

