import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";
import AnnexC1s from "@/models/articles-of-association/annex-c-1";

interface Params {
  organizationId: string;
}

export const GET = async (req: NextRequest, params: Params) => {
  await connectToDatabase();
  try {
    const annexC1s = await AnnexC1s.find({ organizationId: params.organizationId });
    return NextResponse.json(annexC1s, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, params: Params) => {
  await connectToDatabase();
  try {
    const newAnnexC1 = await AnnexC1s.create({
      articles: [],
      organization: params.organizationId,
    });
    return NextResponse.json(newAnnexC1, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
