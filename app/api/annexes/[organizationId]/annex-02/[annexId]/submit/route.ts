import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Annex02 from "@/models/annex-02";
import Notification from "@/models/notification";


export async function POST(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { organizationId, annexId } = params;

    const updatedAnnex = await Annex02.findOneAndUpdate(
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
      text: `${updatedAnnex.organization.name} has submitted Annex 02 for review`,
      date: new Date(),
      link: `/organizations/${organizationId}/annex02`,
      organization: organizationId,
      annex: annexId,
    });

    return NextResponse.json(updatedAnnex);
  } catch (error) {
    console.error("Error submitting Annex L:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
