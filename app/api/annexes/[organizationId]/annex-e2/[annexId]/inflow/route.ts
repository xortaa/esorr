import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import AnnexE1 from "@/models/annex-e1";
import Inflow from "@/models/inflow";
import FinancialReport from "@/models/financial-report";

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

    const inflowDate = new Date(newInflow.date);
    const month = inflowDate.getMonth();
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
    const monthName = monthNames[month];

    if (financialReport[monthName]) {
      financialReport[monthName].inflow.push(newInflow._id);
      financialReport[monthName].totalIncome += newInflow.amount;
      financialReport[monthName].balance += newInflow.amount;
    } else {
      return NextResponse.json({ error: `Month ${monthName} not found in financial report` }, { status: 404 });
    }

    await financialReport.save();

    return NextResponse.json(newInflow, { status: 201 });
  } catch (error) {
    console.error("Error adding inflow to financial report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
