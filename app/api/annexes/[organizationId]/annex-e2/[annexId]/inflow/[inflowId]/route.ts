import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import AnnexE1 from "@/models/annex-e1";
import Inflow from "@/models/inflow";
import FinancialReport from "@/models/financial-report";
import { recalculateFinancialReport } from "@/utils/recalculateFinancialReport";

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
      };
    } else {
      // If the transaction is not found, add it as a new transaction
      financialReport.transactions.push({
        date: new Date(updatedInflow.date),
        amount: updatedInflow.amount,
        type: "inflow",
        category: updatedInflow.category,
        description: updatedInflow.description || "",
      });
    }

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    await financialReport.save();

    return NextResponse.json(updatedInflow);
  } catch (error) {
    console.error("Error updating inflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Existing GET and DELETE routes remain unchanged
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

    // Remove the inflow from AnnexE2
    await AnnexE2.findByIdAndUpdate(params.annexId, {
      $pull: { inflow: params.inflowId },
    });

    // Find the associated AnnexE2 and AnnexE1
    const annexE2 = await AnnexE2.findById(params.annexId);
    if (!annexE2) {
      return NextResponse.json({ error: "AnnexE2 not found" }, { status: 404 });
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
          t.date.toISOString() === inflowToDelete.date.toISOString() &&
          t.amount === inflowToDelete.amount
        )
    );

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    await financialReport.save();

    return NextResponse.json({ message: "Inflow deleted successfully" });
  } catch (error) {
    console.error("Error deleting inflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
