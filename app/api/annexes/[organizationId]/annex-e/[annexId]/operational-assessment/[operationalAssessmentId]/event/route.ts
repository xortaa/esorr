// File: app/api/annexes/[organizationId]/annex-e/[annexId]/operational-assessment/[operationalAssessmentId]/event/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import OperationalAssessment from "@/models/operational-assessment";
import Event from "@/models/event";
import AnnexE from "@/models/annex-e";

export const POST = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; operationalAssessmentId: string } }
) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { operationalAssessmentId } = params;
    const { categories, ...eventData } = body;

    const annexE = await AnnexE.findOne({ operationalAssessments: operationalAssessmentId }).select(
      "organization academicYear"
    );

    const newEventData = { ...eventData, organization: annexE.organization, academicYear: annexE.academicYear };

    const operationalAssessment = await OperationalAssessment.findById(operationalAssessmentId);

    if (!operationalAssessment) {
      return NextResponse.json({ error: "Operational assessment not found" }, { status: 404 });
    }

    const newEvent = await Event.create(newEventData);

    categories.forEach((category: string) => {
      if (!operationalAssessment[category]) {
        return NextResponse.json({ error: `Invalid category: ${category}` }, { status: 400 });
      }
      operationalAssessment[category].push({ event: newEvent._id });
    });

    await operationalAssessment.save();

    return NextResponse.json({ event: newEvent, categories }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; operationalAssessmentId: string } }
) => {
  await connectToDatabase();

  try {
    const { operationalAssessmentId } = params;
    const operationalAssessment = await OperationalAssessment.findById(operationalAssessmentId).populate({
      path: "v01 v02 v03 v04 v05 v06 v07 v08 v09 s1 s2 s3 e1 e2 e3 a1 a2 a3 l1 l2 l3 sdg1 sdg2 sdg3 sdg4 sdg5 sdg6 sdg7 sdg8 sdg9 sdg10 sdg11 sdg12 sdg13 sdg14 sdg15 sdg16 sdg17",
      populate: { path: "event" },
    });

    if (!operationalAssessment) {
      return NextResponse.json({ error: "Operational assessment not found" }, { status: 404 });
    }

    const events = Object.fromEntries(
      Object.entries(operationalAssessment.toObject()).map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.map((item: any) => item.event)];
        }
        return [key, value];
      })
    );

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
