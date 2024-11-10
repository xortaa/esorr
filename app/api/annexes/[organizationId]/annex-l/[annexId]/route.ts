//C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-l\[annexId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexL from "@/models/annex-l";

export async function GET(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { organizationId, annexId } = params;

    const annex = await AnnexL.findOne({
      _id: annexId,
    })
    
      .populate("organization")
      .lean(); // Add .lean() here

    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    return NextResponse.json(annex);
  } catch (error) {
    console.error("Error fetching Annex L:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { organizationId, annexId } = params;
    const body = await request.json();

    const annex = await AnnexL.findOne({
      _id: annexId,
    });

    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    // Update fields using $set to avoid unintentional removal of fields
    const updateFields: any = {};

    if (body.isSubmitted !== undefined) {
      updateFields.isSubmitted = body.isSubmitted;
      updateFields.submissionDate = body.isSubmitted ? new Date() : null;
    }

    if (body.officerInCharge) {
      updateFields.officerInCharge = body.officerInCharge;
    }

    if (body.secretary) {
      updateFields.secretary = body.secretary;
    }

    if (body.president) {
      updateFields.president = body.president;
    }

    if (body.adviser) {
      updateFields.adviser = body.adviser;
    }

    // Update lastModified
    updateFields.lastModified = new Date();

    // Update the document
    const updatedAnnex = await AnnexL.findByIdAndUpdate(
      annexId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("organization");

    return NextResponse.json(updatedAnnex);
  } catch (error) {
    console.error("Error updating Annex L:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
