//C:\Users\kercwin\code\dev\esorr\app\api\signatory-request-organization\[organizationId]\[requestId]\route.ts
import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SignatoryRequests from "@/models/signatory-request";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; requestId: string } }
) => {
  await connectToDatabase();
  try {
    await SignatoryRequests.findByIdAndDelete(params.requestId);
    return NextResponse.json({ message: "Signatory request deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting signatory request:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
