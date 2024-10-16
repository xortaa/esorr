import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexG from "@/models/annex-g";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const annexG = await AnnexG.find({ organizationId: params.organizationId });
    return NextResponse.json(annexG, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
