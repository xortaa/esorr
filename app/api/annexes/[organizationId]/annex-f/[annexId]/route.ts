// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-f\[annexId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexF from "@/models/annex-f";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexF = await AnnexF.findById(params.annexId).populate("organization activities");
    return NextResponse.json(annexF, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnexF = await AnnexF.findByIdAndUpdate(params.annexId, body, { new: true });
    return NextResponse.json(updatedAnnexF, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};