import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const annexE2 = await AnnexE2.find({ organization: params.organizationId }).populate({
        path: "organization",
        select: "name",
      })
      .populate({
        path: "january.inflows january.outflows february.inflows february.outflows march.inflows march.outflows april.inflows april.outflows may.inflows may.outflows june.inflows june.outflows july.inflows july.outflows august.inflows august.outflows september.inflows september.outflows october.inflows october.outflows november.inflows november.outflows december.inflows december.outflows",
      });
    return NextResponse.json(annexE2, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
