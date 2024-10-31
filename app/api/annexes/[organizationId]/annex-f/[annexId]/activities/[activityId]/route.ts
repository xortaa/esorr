import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Activity from "@/models/activity";
import AnnexF from "@/models/annex-f";

export async function PUT(
  req: Request,
  { params }: { params: { organizationId: string; annexId: string; activityId: string } }
) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { term, keyUnitActivity, targetDateRange, actualDateAccomplished, postEventEvaluation, interpretation } =
      body;

    const updatedActivity = await Activity.findByIdAndUpdate(
      params.activityId,
      {
        term,
        keyUnitActivity,
        targetDateRange,
        actualDateAccomplished,
        postEventEvaluation,
        interpretation,
      },
      { new: true, runValidators: true }
    );

    if (!updatedActivity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { organizationId: string; annexId: string; activityId: string } }
) {
  await connectToDatabase();

  try {
    // Delete the activity
    const deletedActivity = await Activity.findByIdAndDelete(params.activityId);
    if (!deletedActivity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // Remove the activity reference from the AnnexF
    await AnnexF.findByIdAndUpdate(params.annexId, {
      $pull: { activities: params.activityId },
    });

    return NextResponse.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
