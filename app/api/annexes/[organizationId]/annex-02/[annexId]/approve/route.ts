import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexH from "@/models/annex-02";

export async function POST(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { organizationId, annexId } = params;

    const updatedAnnex = await AnnexH.findOneAndUpdate(
      { _id: annexId, organization: organizationId },
      { $set: { status: "Approved" } },
      { new: true, runValidators: true }
    ).populate("organization");

    if (!updatedAnnex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnex);
  } catch (error) {
    console.error("Error approving Annex L:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
