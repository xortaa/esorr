import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexF from "@/models/annex-a";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexF = await AnnexF.findById(params.annexId);
    return NextResponse.json(annexF, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
