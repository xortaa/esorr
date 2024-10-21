import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA from "@/models/annex-a";

export async function PATCH(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();
  const { objectives } = await req.json();

  if (!Array.isArray(objectives)) {
    return NextResponse.json({ error: "Invalid objectives data" }, { status: 400 });
  }

  try {
    const updatedAnnexA = await AnnexA.findByIdAndUpdate(
      params.annexId,
      { objectives },
      { new: true, runValidators: true }
    );

    if (!updatedAnnexA) {
      return NextResponse.json({ error: "Annex A not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Objectives updated", data: updatedAnnexA }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; objectiveIndex: string } }
) {
  await connectToDatabase();

  try {
    const annexA = await AnnexA.findById(params.annexId);

    if (!annexA) {
      return NextResponse.json({ error: "Annex A not found" }, { status: 404 });
    }

    const objectiveIndex = parseInt(params.objectiveIndex, 10);

    if (isNaN(objectiveIndex) || objectiveIndex < 0 || objectiveIndex >= annexA.objectives.length) {
      return NextResponse.json({ error: "Invalid objective index" }, { status: 400 });
    }

    annexA.objectives.splice(objectiveIndex, 1);
    await annexA.save();

    return NextResponse.json({ message: "Objective removed successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}