import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import AnnexE1 from "@/models/annex-e1";
import AnnexA from "@/models/annex-a";
import Outflow from "@/models/outflow";
import Event from "@/models/event";
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

    const allOutflows = [];
    for (const month of monthNames) {
      if (annex[month] && annex[month].outflows && annex[month].outflows.length > 0) {
        await annex.populate(`${month}.outflows`);
        const nonArchivedOutflows = annex[month].outflows.filter(outflow => !outflow.archived);
        allOutflows.push(...nonArchivedOutflows);
      }
    }

    return NextResponse.json(allOutflows);
  } catch (error) {
    console.error("Error fetching outflows:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { event: eventId, ...outflowData } = body;

    // Create the new outflow
    const newOutflow = new Outflow({ ...outflowData, event: eventId });
    await newOutflow.save();

    // Update the associated event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    event.outflows.push(newOutflow._id);
    await event.save();

    // Update AnnexE2
    const annex = await AnnexE2.findById(params.annexId);
    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    const month = monthNames[new Date(newOutflow.date).getMonth()];
    if (!annex[month]) {
      annex[month] = { outflows: [], totalOutflow: 0, startingBalance: 0, endingBalance: 0 };
    }
    annex[month].outflows.push(newOutflow._id);
    annex[month].totalOutflow = (annex[month].totalOutflow || 0) + newOutflow.totalCost;

    // Find the associated AnnexE1 and FinancialReport
    const annexE1 = await AnnexE1.findOne({
      academicYear: annex.academicYear,
      organization: annex.organization
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
      date: new Date(newOutflow.date),
      amount: newOutflow.totalCost,
      type: "outflow",
      category: newOutflow.items[0].category,
      description: newOutflow.items[0].description,
      establishment: newOutflow.establishment,
      items: newOutflow.items,
    });

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    // Update AnnexE2 with the recalculated balances
    monthNames.forEach((monthName) => {
      if (annex[monthName]) {
        annex[monthName].startingBalance = financialReport[monthName].startingBalance;
        annex[monthName].endingBalance = financialReport[monthName].endingBalance;
      }
    });

    const annexA = await AnnexA.findOne({
      organization: annex.organization,
      academicYear: annex.academicYear,
    })

    if (!annexA) {
      return NextResponse.json({ error: "AnnexA not found" }, { status: 404 });
    }

    annexA.outflows.push(newOutflow._id);
    await annexA.save()



    await Promise.all([financialReport.save(), annex.save()]);

    return NextResponse.json(newOutflow, { status: 201 });
  } catch (error) {
    console.error("Error creating outflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
