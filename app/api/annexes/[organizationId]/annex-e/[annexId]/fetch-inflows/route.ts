import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE from "@/models/annex-e";
import AnnexE2 from "@/models/annex-e2";

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexE = await AnnexE.findById(params.annexId).select("academicYear");

    const annexE2 = await AnnexE2.findOne({ academicYear: annexE.academicYear, organization: params.organizationId });

    const allInflows = [];
    for (const month of monthNames) {
      if (annexE2[month] && annexE2[month].inflows && annexE2[month].inflows.length > 0) {
        await annexE2.populate(`${month}.inflows`);
        allInflows.push(...annexE2[month].inflows);
      }
    }

    return NextResponse.json(allInflows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
