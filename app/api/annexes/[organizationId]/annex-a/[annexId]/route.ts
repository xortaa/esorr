import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA from "@/models/annex-a";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string, annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexA = await AnnexA.findById(params.annexId);
    return NextResponse.json(annexA, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
