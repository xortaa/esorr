import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexJ from "@/models/annex-j";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexJ = await AnnexJ.findById(params.annexId).populate({
      path: "organization",
      select: "name",
    });
    if (!annexJ) {
      return NextResponse.json({ error: "Annex J not found" }, { status: 404 });
    }
    return NextResponse.json(annexJ, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnexJ = await AnnexJ.findByIdAndUpdate(
      params.annexId,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedAnnexJ) {
      return NextResponse.json({ error: "Annex J not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexJ, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating Annex J" }, { status: 500 });
  }
};
