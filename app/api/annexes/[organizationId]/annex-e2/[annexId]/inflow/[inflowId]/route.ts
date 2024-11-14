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

export async function PUT(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; inflowId: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Find the original inflow before updating
    const originalInflow = await Inflow.findById(params.inflowId);
    if (!originalInflow) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }

    // Update the Inflow model
    const updatedInflow = await Inflow.findByIdAndUpdate(params.inflowId, body, { new: true });
    if (!updatedInflow) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }

    // Find the associated AnnexE2 and AnnexE1
    const annexE2 = await AnnexE2.findById(params.annexId);
    if (!annexE2) {
      return NextResponse.json({ error: "AnnexE2 not found" }, { status: 404 });
    }

    // Determine the original and new months
    const originalMonth = monthNames[new Date(originalInflow.date).getMonth()];
    const newMonth = monthNames[new Date(updatedInflow.date).getMonth()];

    // Update the AnnexE2 document
    if (originalMonth !== newMonth) {
      // Remove from original month
      annexE2[originalMonth].inflows = annexE2[originalMonth].inflows.filter((id) => id.toString() !== params.inflowId);
      annexE2[originalMonth].totalInflow -= originalInflow.amount;

      // Add to new month
      if (!annexE2[newMonth]) {
        annexE2[newMonth] = { inflows: [], totalInflow: 0, startingBalance: 0, endingBalance: 0 };
      }
      annexE2[newMonth].inflows.push(updatedInflow._id);
      annexE2[newMonth].totalInflow += updatedInflow.amount;
    } else {
      // Update total inflow for the month
      annexE2[newMonth].totalInflow += updatedInflow.amount - originalInflow.amount;
    }

    const annexE1 = await AnnexE1.findOne({
      academicYear: annexE2.academicYear,
    });

    if (!annexE1) {
      return NextResponse.json({ error: "AnnexE1 not found" }, { status: 404 });
    }

    // Find the associated FinancialReport
    const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });
    if (!financialReport) {
      return NextResponse.json({ error: "Financial report not found" }, { status: 404 });
    }

    // Update the corresponding transaction in the FinancialReport
    const transactionIndex = financialReport.transactions.findIndex(
      (t) =>
        t.type === "inflow" &&
        t.date.toISOString() === originalInflow.date.toISOString() &&
        t.amount === originalInflow.amount
    );

    if (transactionIndex !== -1) {
      // Replace the old transaction with the updated one
      financialReport.transactions[transactionIndex] = {
        date: new Date(updatedInflow.date),
        amount: updatedInflow.amount,
        type: "inflow",
        category: updatedInflow.category,
        description: updatedInflow.description || "",
        payingParticipants: updatedInflow.payingParticipants,
        totalMembers: updatedInflow.totalMembers,
        merchandiseSales: updatedInflow.merchandiseSales,
      };
    } else {
      // If the transaction is not found, add it as a new transaction
      financialReport.transactions.push({
        date: new Date(updatedInflow.date),
        amount: updatedInflow.amount,
        type: "inflow",
        category: updatedInflow.category,
        description: updatedInflow.description || "",
        payingParticipants: updatedInflow.payingParticipants,
        totalMembers: updatedInflow.totalMembers,
        merchandiseSales: updatedInflow.merchandiseSales,
      });
    }

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    // Update AnnexE2 with the recalculated balances
    monthNames.forEach((month) => {
      if (annexE2[month]) {
        annexE2[month].startingBalance = financialReport[month].startingBalance;
        annexE2[month].endingBalance = financialReport[month].endingBalance;
      }
    });

    await Promise.all([financialReport.save(), annexE2.save()]);

    return NextResponse.json(updatedInflow);
  } catch (error) {
    console.error("Error updating inflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; inflowId: string } }
) {
  try {
    await connectToDatabase();

    // Find the inflow before deleting it
    const inflowToDelete = await Inflow.findById(params.inflowId);
    if (!inflowToDelete) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }

    // Delete the inflow
    const deletedInflow = await Inflow.findByIdAndDelete(params.inflowId);
    if (!deletedInflow) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }

    // Find the associated AnnexE2 and AnnexE1
    const annexE2 = await AnnexE2.findById(params.annexId);
    if (!annexE2) {
      return NextResponse.json({ error: "AnnexE2 not found" }, { status: 404 });
    }

    // Determine the month of the deleted inflow
    const month = monthNames[new Date(deletedInflow.date).getMonth()];

    // Remove the inflow from AnnexE2 and update totalInflow
    if (annexE2[month] && annexE2[month].inflows) {
      annexE2[month].inflows = annexE2[month].inflows.filter((id) => id.toString() !== params.inflowId);
      annexE2[month].totalInflow -= deletedInflow.amount;
    }

    const annexE1 = await AnnexE1.findOne({
      academicYear: annexE2.academicYear,
    });

    if (!annexE1) {
      return NextResponse.json({ error: "AnnexE1 not found" }, { status: 404 });
    }

    // Find the associated FinancialReport
    const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });
    if (!financialReport) {
      return NextResponse.json({ error: "Financial report not found" }, { status: 404 });
    }

    // Remove the corresponding transaction from the FinancialReport
    financialReport.transactions = financialReport.transactions.filter(
      (t) =>
        !(
          t.type === "inflow" &&
          t.date.toISOString() === deletedInflow.date.toISOString() &&
          t.amount === deletedInflow.amount
        )
    );

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    // Update AnnexE2 with the recalculated balances
    monthNames.forEach((monthName) => {
      if (annexE2[monthName]) {
        annexE2[monthName].startingBalance = financialReport[monthName].startingBalance;
        annexE2[monthName].endingBalance = financialReport[monthName].endingBalance;
      }
    });

    await Promise.all([financialReport.save(), annexE2.save()]);

    return NextResponse.json({ message: "Inflow deleted successfully" });
  } catch (error) {
    console.error("Error deleting inflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; inflowId: string } }
) {
  try {
    await connectToDatabase();
    const inflow = await Inflow.findById(params.inflowId);
    if (!inflow) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }
    return NextResponse.json(inflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
