//C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-e3\[annexId]\route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE3 from "@/models/annex-e3";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexE3 = await AnnexE3.findById(params.annexId)
      .populate({
        path: "organization",
        select: "name affiliation",
      })
      .populate("pasoc");
    return NextResponse.json(annexE3, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};


export async function PATCH(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { secretary, president, adviser, isSubmitted } = body;

    const updateData: any = {};

    if (secretary) {
      updateData.secretary = secretary;
    }
    if (president) {
      updateData.president = president;
    }
    if (adviser) {
      updateData.adviser = adviser;
    }
    if (isSubmitted !== undefined) {
      updateData.isSubmitted = isSubmitted;
    }

    const updatedAnnexE3 = await AnnexE3.findByIdAndUpdate(params.annexId, { $set: updateData }, { new: true })
      .populate({
        path: "organization",
        select: "name affiliation",
      })
      .populate("pasoc");

    if (!updatedAnnexE3) {
      return NextResponse.json({ error: "Annex E-3 not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexE3, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating the annex" }, { status: 500 });
  }
}