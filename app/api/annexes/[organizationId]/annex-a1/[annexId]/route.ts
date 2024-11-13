import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA1 from "@/models/annex-a1";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
     const annexA1 = await AnnexA1.findById(params.annexId)
    .populate({
      path: "organization",
      select: "name affiliation"
    })
    .populate({
      path: "officers",
      populate: [
        { path: "educationalBackground" },
        { path: "recordOfExtraCurricularActivities" }
      ]
    });
    return NextResponse.json(annexA1, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
