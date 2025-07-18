import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA from "@/models/annex-a";
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
    const annexA = await AnnexA.findById(params.annexId).select("academicYear");

    console.log("logging annexa: ", annexA);

    const annexE2 = await AnnexE2.findOne({ academicYear: annexA.academicYear, organization: params.organizationId });

    const allInflows = [];
    for (const month of monthNames) {
      if (annexE2[month] && annexE2[month].inflows && annexE2[month].inflows.length > 0) {
        await annexE2.populate(`${month}.inflows`);
        const nonArchivedInflows = annexE2[month].inflows.filter((inflow) => !inflow.archived);
        allInflows.push(...nonArchivedInflows);
      }
    }

    return NextResponse.json(allInflows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
