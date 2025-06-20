// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-f\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexF from "@/models/annex-f";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const annexF = await AnnexF.find({ organization: params.organizationId });
    return NextResponse.json(annexF, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
