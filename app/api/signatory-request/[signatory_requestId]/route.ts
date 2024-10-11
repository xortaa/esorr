import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SignatoryRequests from "@/models/signatory-request";

export const PATCH = async (req: NextRequest, { params }: { params: { signatory_requestId: string } }) => {
  await connectToDatabase();

  try {
    const signatoryRequest = await SignatoryRequests.findByIdAndDelete(
      params.signatory_requestId
    );

    let user = await Users.findOne({ email: signatoryRequest.email });

    if (user) {
      user.organizations.push(signatoryRequest.organization);
    } else {
      user = new Users({
        email: signatoryRequest.email,
        role: signatoryRequest.role,
        organizations: [signatoryRequest.organization],
        position: signatoryRequest.position,
        isExecutive: signatoryRequest.isExecutive,
      });
    }

    await user.save();

    return NextResponse.json({ message: "Signatory Request Approved" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { signatory_requestId: string } }) => {
  await connectToDatabase();

  try {
    await SignatoryRequests.findByIdAndUpdate(params.signatory_requestId, { isArchived: true });

    return NextResponse.json({ message: "Signatory Request Archived" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
