import Affiliations from "@/models/affiliation";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";
import { AffiliationResponse, AffiliationInput } from "@/types";

export const GET = async (req: NextRequest, { params }: { params: { affiliationId: string } }) => {
  await connectToDatabase();

  try {
    const affiliation: AffiliationResponse = await Affiliations.findById(params.affiliationId);
    if (!affiliation) {
      return NextResponse.json({ error: "Affiliation not found" }, { status: 404 });
    }
    return NextResponse.json(affiliation, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { affiliationId: string } }) => {
  await connectToDatabase();

  const affiliationInput: AffiliationInput = await req.json();

  try {
    const updatedAffiliation: AffiliationResponse = await Affiliations.findByIdAndUpdate(params.affiliationId, affiliationInput, {
      new: true,
    });
    return NextResponse.json(updatedAffiliation, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { affiliationId: string } }) => {
  await connectToDatabase();

  try {
    const affiliation: AffiliationResponse = await Affiliations.findByIdAndDelete(params.affiliationId);
    if (!affiliation) {
      return NextResponse.json({ error: "Affiliation not found" }, { status: 404 });
    }
    return NextResponse.json(affiliation, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
