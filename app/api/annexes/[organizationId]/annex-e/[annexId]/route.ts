import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE from "@/models/annex-e";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexE = await AnnexE.findById(params.annexId).populate({
      path: "organization",
      select: "name affiliation"
    }).populate({
      path: "operationalAssessment",
      populate: [
        {
          path: "v01.event",
          populate: { path: "outflows" },
        },
        {
          path: "v02.event",
          populate: { path: "outflows" },
        },
        {
          path: "v03.event",
          populate: { path: "outflows" },
        },
        {
          path: "v04.event",
          populate: { path: "outflows" },
        },
        {
          path: "v05.event",
          populate: { path: "outflows" },
        },
        {
          path: "v06.event",
          populate: { path: "outflows" },
        },
        {
          path: "v07.event",
          populate: { path: "outflows" },
        },
        {
          path: "v08.event",
          populate: { path: "outflows" },
        },
        {
          path: "v09.event",
          populate: { path: "outflows" },
        },
        {
          path: "s1.event",
          populate: { path: "outflows" },
        },
        {
          path: "s2.event",
          populate: { path: "outflows" },
        },
        {
          path: "s3.event",
          populate: { path: "outflows" },
        },
        {
          path: "e1.event",
          populate: { path: "outflows" },
        },
        {
          path: "e2.event",
          populate: { path: "outflows" },
        },
        {
          path: "e3.event",
          populate: { path: "outflows" },
        },
        {
          path: "a1.event",
          populate: { path: "outflows" },
        },
        {
          path: "a2.event",
          populate: { path: "outflows" },
        },
        {
          path: "a3.event",
          populate: { path: "outflows" },
        },
        {
          path: "l1.event",
          populate: { path: "outflows" },
        },
        {
          path: "l2.event",
          populate: { path: "outflows" },
        },
        {
          path: "l3.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg1.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg2.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg3.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg4.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg5.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg6.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg7.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg8.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg9.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg10.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg11.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg12.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg13.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg14.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg15.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg16.event",
          populate: { path: "outflows" },
        },
        {
          path: "sdg17.event",
          populate: { path: "outflows" },
        },
      ],
    });

    return NextResponse.json(annexE, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const { annexId } = params;
    const updateData = await req.json();

    // Validate the update data
    const allowedFields = [
      "outgoingSecretary",
      "outgoingPresident",
      "incomingSecretary",
      "incomingPresident",
      "adviser",
    ];
    const updateField = Object.keys(updateData)[0];

    if (!allowedFields.includes(updateField)) {
      return NextResponse.json({ error: "Invalid signature field" }, { status: 400 });
    }

    // Find and update the Annex E document
    const updatedAnnexE = await AnnexE.findByIdAndUpdate(
      annexId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAnnexE) {
      return NextResponse.json({ error: "Annex E not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexE, { status: 200 });
  } catch (error) {
    console.error("Error updating Annex E signature:", error);
    return NextResponse.json({ error: "An error occurred while updating Annex E signature" }, { status: 500 });
  }
};