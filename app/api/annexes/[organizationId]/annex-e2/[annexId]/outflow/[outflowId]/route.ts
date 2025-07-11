import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import AnnexE1 from "@/models/annex-e1";
import Outflow from "@/models/outflow";
import FinancialReport from "@/models/financial-report";
import Event from "@/models/event";
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

export async function GET(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string } }
) {
  try {
    await connectToDatabase();
    const outflow = await Outflow.findById(params.outflowId).populate("event", "title eReserveNumber");
    if (!outflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }
    return NextResponse.json(outflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { event: newEventId, ...outflowData } = body;

    const originalOutflow = await Outflow.findById(params.outflowId);
    if (!originalOutflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    // If the event has changed, update both the old and new events
    if (originalOutflow.event.toString() !== newEventId) {
      await Event.findByIdAndUpdate(originalOutflow.event, { $pull: { outflows: originalOutflow._id } });
      await Event.findByIdAndUpdate(newEventId, { $push: { outflows: originalOutflow._id } });
    }

    const updatedOutflow = await Outflow.findByIdAndUpdate(
      params.outflowId,
      { $set: { ...outflowData, event: newEventId } },
      { new: true }
    );
    if (!updatedOutflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    // Find the associated AnnexE2, AnnexE1, and FinancialReport
    const annexE2 = await AnnexE2.findById(params.annexId);
    if (!annexE2) {
      return NextResponse.json({ error: "AnnexE2 not found" }, { status: 404 });
    }

    const originalMonth = monthNames[new Date(originalOutflow.date).getMonth()];
    const newMonth = monthNames[new Date(updatedOutflow.date).getMonth()];

    // Update AnnexE2
    if (originalMonth !== newMonth) {
      // Remove from original month
      annexE2[originalMonth].outflows = annexE2[originalMonth].outflows.filter(
        (id) => id.toString() !== params.outflowId
      );
      annexE2[originalMonth].totalOutflow -= originalOutflow.totalCost;

      // Add to new month
      if (!annexE2[newMonth]) {
        annexE2[newMonth] = { outflows: [], totalOutflow: 0, startingBalance: 0, endingBalance: 0 };
      }
      annexE2[newMonth].outflows.push(updatedOutflow._id);
      annexE2[newMonth].totalOutflow += updatedOutflow.totalCost;
    } else {
      // Update total outflow for the month
      annexE2[newMonth].totalOutflow += updatedOutflow.totalCost - originalOutflow.totalCost;
    }

    const annexE1 = await AnnexE1.findOne({
      academicYear: annexE2.academicYear,
      organization: annexE2.organization,
    });

    if (!annexE1) {
      return NextResponse.json({ error: "AnnexE1 not found" }, { status: 404 });
    }

    const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });
    if (!financialReport) {
      return NextResponse.json({ error: "Financial report not found" }, { status: 404 });
    }

    // Update the corresponding transaction in the FinancialReport
    const transactionIndex = financialReport.transactions.findIndex(
      (t) =>
        t.type === "outflow" &&
        t.date.toISOString() === originalOutflow.date.toISOString() &&
        t.amount === originalOutflow.totalCost
    );

    if (transactionIndex !== -1) {
      financialReport.transactions[transactionIndex] = {
        date: new Date(updatedOutflow.date),
        amount: updatedOutflow.totalCost,
        type: "outflow",
        category: updatedOutflow.items[0].category,
        description: updatedOutflow.items[0].description,
        establishment: updatedOutflow.establishment,
        items: updatedOutflow.items,
      };
    }

    // Recalculate the entire financial report
    recalculateFinancialReport(financialReport);

    // Update AnnexE2 with recalculated balances
    monthNames.forEach((monthName) => {
      if (annexE2[monthName]) {
        annexE2[monthName].startingBalance = financialReport[monthName].startingBalance;
        annexE2[monthName].endingBalance = financialReport[monthName].endingBalance;
      }
    });

    await Promise.all([financialReport.save(), annexE2.save()]);

    return NextResponse.json(updatedOutflow);
  } catch (error) {
    console.error("Error updating outflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string } }
) {
  try {
    await connectToDatabase();
    const deletedOutflow = await Outflow.findById(params.outflowId);
    if (!deletedOutflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    // Delete image if exists
    // if (deletedOutflow.image) {
    //   const fileName = deletedOutflow.image.split("/").pop();
    //   if (fileName) {
    //     try {
    //       const deleteResponse = await fetch("/api/delete-file", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ fileName }),
    //       });

    //       if (!deleteResponse.ok) {
    //         console.error("Failed to delete file:", await deleteResponse.text());
    //       }
    //     } catch (error) {
    //       console.error("Error deleting file:", error);
    //     }
    //   }
    // }

    // Remove the outflow from the associated event
    await Event.findByIdAndUpdate(deletedOutflow.event, { $pull: { outflows: deletedOutflow._id } });

    await Outflow.findByIdAndUpdate(params.outflowId, {isArchived: true}, { new: true });

    // Update AnnexE2
    const annexE2 = await AnnexE2.findById(params.annexId);
    if (annexE2) {
      const month = monthNames[new Date(deletedOutflow.date).getMonth()];
      if (annexE2[month] && annexE2[month].outflows) {
        annexE2[month].outflows = annexE2[month].outflows.filter((id) => id.toString() !== params.outflowId);
        annexE2[month].totalOutflow -= deletedOutflow.totalCost;
      }

      const annexE1 = await AnnexE1.findOne({
        academicYear: annexE2.academicYear,
        organization: annexE2.organization
      });

      if (annexE1) {
        const financialReport = await FinancialReport.findOne({ annexE1: annexE1._id });
        if (financialReport) {
          // Remove the corresponding transaction from the FinancialReport
          financialReport.transactions = financialReport.transactions.filter(
            (t) =>
              !(
                t.type === "outflow" &&
                t.date.toISOString() === deletedOutflow.date.toISOString() &&
                t.amount === deletedOutflow.totalCost
              )
          );

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

    return NextResponse.json({ message: "Outflow deleted successfully" });
  } catch (error) {
    console.error("Error deleting outflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
