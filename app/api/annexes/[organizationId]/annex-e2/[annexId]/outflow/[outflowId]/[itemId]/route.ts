import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import AnnexE1 from "@/models/annex-e1";
import Outflow from "@/models/outflow";
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
  { params }: { params: { organizationId: string; annexId: string; outflowId: string; itemId: string } }
) {
  try {
    await connectToDatabase();
    const { organizationId, annexId, outflowId, itemId } = params;
    const updatedItem = await request.json();

    const outflow = await Outflow.findById(outflowId);
    if (!outflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    const itemIndex = outflow.items.findIndex((item: any) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const oldTotalCost = outflow.totalCost;
    outflow.items[itemIndex] = { ...outflow.items[itemIndex], ...updatedItem };
    outflow.totalCost = outflow.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    await outflow.save();

    // Update AnnexE2 and FinancialReport if totalCost has changed
    if (oldTotalCost !== outflow.totalCost) {
      const annexE2 = await AnnexE2.findById(annexId);
      if (annexE2) {
        const month = monthNames[new Date(outflow.date).getMonth()];
        if (annexE2[month]) {
          annexE2[month].totalOutflow += outflow.totalCost - oldTotalCost;
          await annexE2.save();
        }

        const annexE1 = await AnnexE1.findOne({
          academicYear: annexE2.academicYear,
          organization: annexE2.organization,
        });

        if (annexE1) {
          const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });
          if (financialReport) {
            const transactionIndex = financialReport.transactions.findIndex(
              (t) =>
                t.type === "outflow" && t.date.toISOString() === outflow.date.toISOString() && t.amount === oldTotalCost
            );

            if (transactionIndex !== -1) {
              financialReport.transactions[transactionIndex].amount = outflow.totalCost;
              financialReport.transactions[transactionIndex].description = outflow.items
                .map((item) => item.description)
                .join(", ");
            }

            // Recalculate the financial report
            recalculateFinancialReport(financialReport);

            // Update AnnexE2 with recalculated balances
            monthNames.forEach((monthName) => {
              if (annexE2[monthName]) {
                annexE2[monthName].startingBalance = financialReport[monthName].startingBalance;
                annexE2[monthName].endingBalance = financialReport[monthName].endingBalance;
              }
            });

            await Promise.all([financialReport.save(), annexE2.save()]);
          }
        }
      }
    }

    return NextResponse.json(outflow.items[itemIndex]);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string; itemId: string } }
) {
  try {
    await connectToDatabase();
    const { organizationId, annexId, outflowId, itemId } = params;

    const outflow = await Outflow.findById(outflowId);
    if (!outflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    const oldTotalCost = outflow.totalCost;
    outflow.items = outflow.items.filter((item: any) => item._id.toString() !== itemId);
    outflow.totalCost = outflow.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    await outflow.save();

    // Update AnnexE2 and FinancialReport if totalCost has changed
    if (oldTotalCost !== outflow.totalCost) {
      const annexE2 = await AnnexE2.findById(annexId);
      if (annexE2) {
        const month = monthNames[new Date(outflow.date).getMonth()];
        if (annexE2[month]) {
          annexE2[month].totalOutflow += outflow.totalCost - oldTotalCost;
          await annexE2.save();
        }

        const annexE1 = await AnnexE1.findOne({
          academicYear: annexE2.academicYear,
          organization: annexE2.organization,
        });

        if (annexE1) {
          const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });
          if (financialReport) {
            const transactionIndex = financialReport.transactions.findIndex(
              (t) =>
                t.type === "outflow" && t.date.toISOString() === outflow.date.toISOString() && t.amount === oldTotalCost
            );

            if (transactionIndex !== -1) {
              financialReport.transactions[transactionIndex].amount = outflow.totalCost;
              financialReport.transactions[transactionIndex].description = outflow.items
                .map((item) => item.description)
                .join(", ");
            }

            // Recalculate the financial report
            recalculateFinancialReport(financialReport);

            // Update AnnexE2 with recalculated balances
            monthNames.forEach((monthName) => {
              if (annexE2[monthName]) {
                annexE2[monthName].startingBalance = financialReport[monthName].startingBalance;
                annexE2[monthName].endingBalance = financialReport[monthName].endingBalance;
              }
            });

            await Promise.all([financialReport.save(), annexE2.save()]);
          }
        }
      }
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
