import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Affiliations from "@/models/affiliation";

export const POST = async (req: NextRequest, { params }: { params: { affiliationId: string } }) => {
  await connectToDatabase();

  const { name } = await req.json();

  try {
    const updatedAffiliation = await Affiliations.findByIdAndUpdate(
      params.affiliationId,
      { $push: { programs: { name } } },
      { new: true }
    );

    if (!updatedAffiliation) {
      return NextResponse.json({ error: "Affiliation not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAffiliation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
