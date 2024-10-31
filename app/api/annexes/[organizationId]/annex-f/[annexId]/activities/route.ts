import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexF from "@/models/annex-f";
import Activity from "@/models/activity";

export async function GET(req: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const annexF = await AnnexF.findById(params.annexId).populate("activities");
    if (!annexF) {
      return NextResponse.json({ error: "Annex F not found" }, { status: 404 });
    }
    return NextResponse.json(annexF.activities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const activity = new Activity(body);
    await activity.save();

    await AnnexF.findByIdAndUpdate(params.annexId, { $push: { activities: activity._id } });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const annexF = await AnnexF.findById(params.annexId);
    if (!annexF) {
      return NextResponse.json({ error: "Annex F not found" }, { status: 404 });
    }

    annexF.activities = body.terms.flatMap((term) => term.activities.map((activity) => activity.id));
    await annexF.save();

    return NextResponse.json({ message: "Annex F updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update Annex F" }, { status: 500 });
  }
}
