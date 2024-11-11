// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-g\[annexId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexG from "@/models/annex-g";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexG = await AnnexG.findById(params.annexId).populate("nominees");
    return NextResponse.json(annexG, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    let updateData = { ...body };

    // Handle signature submission
    if (body.presidentSignature) {
      updateData.presidentSignature = {
        ...body.presidentSignature,
        dateSigned: new Date(),
      };
    }

    const updatedAnnexG = await AnnexG.findByIdAndUpdate(params.annexId, updateData, { new: true }).populate(
      "nominees"
    );

    return NextResponse.json(updatedAnnexG, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
