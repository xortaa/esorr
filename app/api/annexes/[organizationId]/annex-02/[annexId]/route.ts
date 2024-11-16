import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Annex02 from "@/models/annex-02";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annex02 = await Annex02.findById(params.annexId).populate({
      path: "organization",
      select: "name",
    });
    return NextResponse.json(annex02, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnex = await Annex02.findByIdAndUpdate(
      params.annexId,
      { ...body, submissionDate: body.isSubmitted ? new Date() : undefined },
      { new: true }
    ).populate({
      path: "organization",
      select: "name",
    });

    if (!updatedAnnex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnex, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
