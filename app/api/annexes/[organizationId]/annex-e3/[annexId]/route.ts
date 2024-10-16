import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE3 from "@/models/annex-e3";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexE3 = await AnnexE3.findById(params.annexId);
    return NextResponse.json(annexE3, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
