import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexC1s from "@/models/articles-of-association/annex-c-1";
import { AnnexC1Input } from "@/types";

interface Params {
  organizationId: string;
  annexC1Id: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  try {
    const annexC1s = await AnnexC1s.findById(params.annexC1Id);
    return NextResponse.json(annexC1s, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  const annexC1Input: AnnexC1Input = await req.json();
  try {
    const updatedAnnexC1 = await AnnexC1s.findByIdAndUpdate(params.annexC1Id, annexC1Input, { new: true });
    return NextResponse.json(updatedAnnexC1, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
