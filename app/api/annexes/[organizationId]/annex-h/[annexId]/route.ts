import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexH from "@/models/annex-h";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexH = await AnnexH.findById(params.annexId).populate("organization");
    if (!annexH) {
      return NextResponse.json({ error: "Annex H not found" }, { status: 404 });
    }
    return NextResponse.json(annexH, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnexH = await AnnexH.findByIdAndUpdate(
      params.annexId,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedAnnexH) {
      return NextResponse.json({ error: "Annex H not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexH, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating Annex H" }, { status: 500 });
  }
};
