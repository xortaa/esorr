import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Affiliations from "@/models/affiliation";
import { AffiliationInput, AffiliationResponse } from "@/types";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const affiliations: AffiliationResponse[] = await Affiliations.find({ isArchived: false });
    return NextResponse.json(affiliations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await connectToDatabase();

  const affiliationInput: AffiliationInput = await req.json();

  try {
    const newAffiliation = await Affiliations.create(affiliationInput);
    return NextResponse.json(newAffiliation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
