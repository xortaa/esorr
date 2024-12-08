// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-e2\[annexId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexE2 = await AnnexE2.findById(params.annexId)
      .populate({
        path: "organization",
        select: "name",
      })
      .populate({
        path: "january.inflows january.outflows february.inflows february.outflows march.inflows march.outflows april.inflows april.outflows may.inflows may.outflows june.inflows june.outflows july.inflows july.outflows august.inflows august.outflows september.inflows september.outflows october.inflows october.outflows november.inflows november.outflows december.inflows december.outflows",
      });

    if (!annexE2) {
      return NextResponse.json({ error: "Annex E2 not found" }, { status: 404 });
    }

    // Ensure all months have at least an empty array for inflows and outflows
    const months = [
      "august",
      "september",
      "october",
      "november",
      "december",
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
    ];
    months.forEach((month) => {
      if (!annexE2[month]) {
        annexE2[month] = { inflows: [], outflows: [], totalInflow: 0, totalOutflow: 0 };
      } else {
        annexE2[month].inflows = annexE2[month].inflows || [];
        annexE2[month].outflows = annexE2[month].outflows || [];
        annexE2[month].totalInflow = annexE2[month].totalInflow || 0;
        annexE2[month].totalOutflow = annexE2[month].totalOutflow || 0;
      }
    });

    return NextResponse.json(annexE2, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const annexE2 = await AnnexE2.findById(params.annexId);

    if (!annexE2) {
      return NextResponse.json({ error: "Annex E2 not found" }, { status: 404 });
    }

    // Update the annex with the new data
    Object.keys(body).forEach((key) => {
      if (key.includes(".")) {
        const [month, field] = key.split(".");
        if (!annexE2[month]) {
          annexE2[month] = {};
        }
        annexE2[month][field] = body[key];
      } else {
        annexE2[key] = body[key];
      }
    });

    await annexE2.save();

    return NextResponse.json(annexE2, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
