import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE1 from "@/models/annex-e1";

export async function POST(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { organizationId, annexId } = params;
    const { remarks } = await request.json();

    const updatedAnnex = await AnnexE1.findOneAndUpdate(
      { _id: annexId, organization: organizationId },
      { $set: { soccRemarks: remarks } },
      { new: true, runValidators: true }
    ).populate("organization");

    if (!updatedAnnex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnex);
  } catch (error) {
    console.error("Error updating SOCC remarks for Annex L:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
