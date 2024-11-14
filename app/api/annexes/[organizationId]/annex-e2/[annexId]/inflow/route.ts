import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import AnnexE1 from "@/models/annex-e1";
import Inflow from "@/models/inflow";
import FinancialReport from "@/models/financial-report";
import { recalculateFinancialReport } from "@/utils/recalculateFinancialReport";

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

export async function GET(request: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const annex = await AnnexE2.findById(params.annexId);
    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    const allInflows = [];
    for (const month of monthNames) {
      if (annex[month] && annex[month].inflows && annex[month].inflows.length > 0) {
        await annex.populate(`${month}.inflows`);
        allInflows.push(...annex[month].inflows);
      }
    }

    return NextResponse.json(allInflows);
  } catch (error) {
    console.error("Error fetching inflows:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newInflow = new Inflow(body);
    await newInflow.save();

    const annex = await AnnexE2.findById(params.annexId);
    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    // Get the month from the inflow date
    const inflowDate = new Date(newInflow.date);
    const monthName = monthNames[inflowDate.getMonth()];

    // Push the new inflow to the specific month's report
    if (!annex[monthName]) {
      annex[monthName] = { inflows: [] };
    }
    annex[monthName].inflows.push(newInflow._id);
    annex[monthName].totalInflow = (annex[monthName].totalInflow || 0) + newInflow.amount;

    await annex.save();

    // Find the associated AnnexE1 and FinancialReport
    const annexE1 = await AnnexE1.findOne({
      academicYear: annex.academicYear,
    });

    if (!annexE1) {
      return NextResponse.json({ error: "AnnexE1 not found" }, { status: 404 });
    }

    const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });
    if (!financialReport) {
      return NextResponse.json({ error: "Financial report not found" }, { status: 404 });
    }

    // Add new transaction to FinancialReport
    financialReport.transactions.push({
      date: new Date(newInflow.date),
      amount: newInflow.amount,
      type: "inflow",
      category: newInflow.category,
      description: "",
      payingParticipants: newInflow.payingParticipants,
      totalMembers: newInflow.totalMembers,
      merchandiseSales: newInflow.merchandiseSales,
    });

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    monthNames.forEach((month) => {
      if (annex[month]) {
        annex[month].startingBalance = financialReport[month].startingBalance;
        annex[month].endingBalance = financialReport[month].endingBalance;
      }
    });

    await Promise.all([financialReport.save(), annex.save()]);
    
    return NextResponse.json(newInflow, { status: 201 });
  } catch (error) {
    console.error("Error creating inflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
