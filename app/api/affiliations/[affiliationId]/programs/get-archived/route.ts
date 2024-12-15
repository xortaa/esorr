import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Affiliations from "@/models/affiliation";

export const GET = async (req: NextRequest, { params }: { params: { affiliationId: string } }) => {
  await connectToDatabase();

  const programs = await Affiliations.findOne(
    { _id: params.affiliationId },
    { programs: { $elemMatch: { isArchived: true } } }
  );

  return NextResponse.json(programs, { status: 200 });
};

