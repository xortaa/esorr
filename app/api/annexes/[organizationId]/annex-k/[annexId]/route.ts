// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-k\[annexId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexK from "@/models/annex-k";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexK = await AnnexK.findById(params.annexId).lean();
    if (!annexK) {
      return NextResponse.json({ error: "Annex K not found" }, { status: 404 });
    }
    return NextResponse.json(annexK, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnexK = await AnnexK.findByIdAndUpdate(
      params.annexId,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedAnnexK) {
      return NextResponse.json({ error: "Annex K not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexK, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating Annex K" }, { status: 500 });
  }
};