import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexE2 = await AnnexE2.findOne({ organization: params.organizationId, _id: params.annexId }).select(
      "academicYear"
    );

    const academicYear = annexE2?.academicYear;

    return NextResponse.json({academicYear}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
