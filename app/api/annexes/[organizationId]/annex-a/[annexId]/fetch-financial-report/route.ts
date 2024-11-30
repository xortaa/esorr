import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA from "@/models/annex-a";
import AnnexE1 from "@/models/annex-e1";
import FinancialReport from "@/models/financial-report";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexA = await AnnexA.findById(params.annexId).select("academicYear");

    const annexE1 = await AnnexE1.findOne({ academicYear: annexA.academicYear, organization: params.organizationId });

    const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });

    return NextResponse.json(financialReport);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
