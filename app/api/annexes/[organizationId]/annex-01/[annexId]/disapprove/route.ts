import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Annex01 from "@/models/annex-01";
import Notification from "@/models/notification";

export async function POST(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { organizationId, annexId } = params;

    const updatedAnnex = await Annex01.findOneAndUpdate(
      { _id: annexId, organization: organizationId },
      { $set: { status: "Rejected" } },
      { new: true, runValidators: true }
    ).populate("organization");

    if (!updatedAnnex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    // delete notification

    await Notification.findOneAndDelete({
      organization: organizationId,
      annex: annexId,
    });

    return NextResponse.json(updatedAnnex);
  } catch (error) {
    console.error("Error disapproving Annex L:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
