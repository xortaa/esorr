import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import FinancialReport from "@/models/financial-report";

export async function GET(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const financialReport = await FinancialReport.find({
      annexE1: params.annexId,
    });
    return NextResponse.json(financialReport);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
