import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexI from "@/models/annex-i";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexI = await AnnexI.findById(params.annexId).lean();
    if (!annexI) {
      return NextResponse.json({ error: "Annex I not found" }, { status: 404 });
    }
    return NextResponse.json(annexI, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnexI = await AnnexI.findByIdAndUpdate(
      params.annexId,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedAnnexI) {
      return NextResponse.json({ error: "Annex I not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexI, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating Annex I" }, { status: 500 });
  }
};
