import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SignatoryRequests from "@/models/signatory-request";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const signatoryRequests = await SignatoryRequests.find({ isArchived: false }).populate({
      path: "organization",
      select: "name",
    });
    return NextResponse.json(signatoryRequests, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
