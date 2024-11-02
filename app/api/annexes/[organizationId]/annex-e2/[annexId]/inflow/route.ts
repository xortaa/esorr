import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import AnnexE1 from "@/models/annex-e1";
import Inflow from "@/models/inflow";
import FinancialReport from "@/models/financial-report";
import { recalculateFinancialReport } from "@/utils/recalculateFinancialReport";

export async function GET(request: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const annex = await AnnexE2.findById(params.annexId).populate("inflow");
    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }
    return NextResponse.json(annex.inflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newInflow = new Inflow(body);

    if (isNaN(newInflow.amount) || newInflow.amount <= 0) {
      return NextResponse.json({ error: "Invalid inflow amount" }, { status: 400 });
    }

    await newInflow.save();

    const annexE2 = await AnnexE2.findById(params.annexId);
    if (!annexE2) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    annexE2.inflow.push(newInflow._id);
    await annexE2.save();

    const annexE1 = await AnnexE1.findOne({
      academicYear: annexE2.academicYear,
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
      description: newInflow.description || "",
    });

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    await financialReport.save();

    return NextResponse.json(newInflow, { status: 201 });
  } catch (error) {
    console.error("Error adding inflow to financial report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}