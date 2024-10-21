import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SignatoryRequest from "@/models/signatory-request";
import Organization from "@/models/organization";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { email, signatories } = await req.json();

  if (!email || !signatories || !Array.isArray(signatories)) {
    return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
  }

  try {
    const newOrganization = await Organization.create({
      name: "Student Organizations Coordinating Council",
    });

    const signatoryRequests = await Promise.all(
      signatories.map(async (signatory: { signatoryEmail: string; position: string }) => {
        return await SignatoryRequest.create({
          email: signatory.signatoryEmail,
          position: signatory.position,
          role: "SOCC-SIGNATORY",
          requestedBy: email,
          organization: newOrganization._id,
        });
      })
    );

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        isSetup: true,
      }
    );

    return NextResponse.json(
      {
        signatory: signatoryRequests,
        organization: newOrganization,
        updatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating signatory requests:", error);
    return NextResponse.json({ error: "An error occurred while creating the signatory requests" }, { status: 500 });
  }
}
