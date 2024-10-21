import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SignatoryRequests from "@/models/signatory-request";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const signatoryRequests = await SignatoryRequests.find({
      organization: params.organizationId,
    });

    return NextResponse.json(signatoryRequests, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();
  try {
    const { email, position, requestedBy, isExecutive } = await req.json();

    const signatoryRequest = await SignatoryRequests.create({
      email,
      position,
      requestedBy,
      isExecutive,
      organization: params.organizationId,
      role: "RSO-SIGNATORY",
    });

    return NextResponse.json(signatoryRequest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
