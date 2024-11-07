// File: app/api/annexes/[organizationId]/annex-e/[annexId]/operational-assessment/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import OperationalAssessment from "@/models/operational-assessment";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();
  try {
    const { annexId } = params;
    const operationalAssessment = await OperationalAssessment.findOne({
      annexE: annexId,
    }).populate({
      path: "v01.event v02.event v03.event v04.event v05.event v06.event v07.event v08.event v09.event s1.event s2.event s3.event e1.event e2.event e3.event a1.event a2.event a3.event l1.event l2.event l3.event sdg1.event sdg2.event sdg3.event sdg4.event sdg5.event sdg6.event sdg7.event sdg8.event sdg9.event sdg10.event sdg11.event sdg12.event sdg13.event sdg14.event sdg15.event sdg16.event sdg17.event",
      select: "title eReserveNumber",
    });

    if (!operationalAssessment) {
      return NextResponse.json({ error: "Operational assessment not found" }, { status: 404 });
    }

    return NextResponse.json(operationalAssessment, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
