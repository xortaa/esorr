// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-01\[annexId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Annex01 from "@/models/annex-01";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annex01 = await Annex01.findById(params.annexId);
    return NextResponse.json(annex01, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnex = await Annex01.findByIdAndUpdate(params.annexId, body, { new: true });
    return NextResponse.json(updatedAnnex, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
