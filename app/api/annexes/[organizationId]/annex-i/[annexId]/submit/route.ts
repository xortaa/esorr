import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexI from "@/models/annex-i";
import Notification from "@/models/notification";

export async function POST(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { organizationId, annexId } = params;

    const updatedAnnex = await AnnexI.findOneAndUpdate(
      { _id: annexId, organization: organizationId },
      {
        $set: {
          status: "For Review",
          dateSubmitted: new Date(),
          isSubmitted: true,
        },
      },
      { new: true, runValidators: true }
    ).populate("organization");

    if (!updatedAnnex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    // create notification

    await Notification.create({
      text: `${updatedAnnex.organization.name} has submitted Annex I for review`,
      date: new Date(),
      link: `/organizations/${organizationId}/annexI`,
      organization: organizationId,
      annex: annexId,
    });

    return NextResponse.json(updatedAnnex);
  } catch (error) {
    console.error("Error submitting Annex L:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
