// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-g\[annexId]\nominee\[nomineeId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Nominee from "@/models/nominee";

export async function PUT(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; nomineeId: string } }
) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { name, faculty, email, landline, mobile, cv } = body;

    const updatedNominee = await Nominee.findByIdAndUpdate(
      params.nomineeId,
      { name, faculty, email, landline, mobile, cv },
      { new: true }
    );

    if (!updatedNominee) {
      return NextResponse.json({ error: "Nominee not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNominee, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
