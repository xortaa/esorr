import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SignatoryRequests from "@/models/signatory-request";
import Organization from "@/models/organization";

export const PATCH = async (req: NextRequest, { params }: { params: { signatory_requestId: string } }) => {
  await connectToDatabase();

  try {
    const signatoryRequest = await SignatoryRequests.findById(params.signatory_requestId);

    if (!signatoryRequest) {
      return NextResponse.json({ error: "Signatory request not found" }, { status: 404 });
    }

    let user = await Users.findOne({ email: signatoryRequest.email });

    if (user) {
      // Check if the organization already exists in the user's organizations array
      const organizationExists = user.organizations.some(
        (org) => org.toString() === signatoryRequest.organization.toString()
      );

      // If the organization doesn't exist, add it to the organizations array
      if (!organizationExists) {
        user.organizations.push(signatoryRequest.organization);
      }

      // Update or add the position
      const existingPositionIndex = user.positions.findIndex(
        (pos) => pos.organization.toString() === signatoryRequest.organization.toString()
      );

      if (existingPositionIndex !== -1) {
        user.positions[existingPositionIndex].position = signatoryRequest.position;
      } else {
        user.positions.push({
          organization: signatoryRequest.organization,
          position: signatoryRequest.position,
        });
      }

      await user.save();
    } else {
      user = await Users.create({
        email: signatoryRequest.email,
        role: signatoryRequest.role,
        organizations: [signatoryRequest.organization],
        positions: [
          {
            organization: signatoryRequest.organization,
            position: signatoryRequest.position,
          },
        ],
      });

      await Organization.findByIdAndUpdate(signatoryRequest.organization, {
        $push: { signatories: user._id },
      });
    }

    // Delete the signatory request after approval
    await SignatoryRequests.findByIdAndDelete(params.signatory_requestId);

    return NextResponse.json({ message: "Signatory Request Approved", user }, { status: 200 });
  } catch (error) {
    console.error("Error processing signatory request:", error);
    return NextResponse.json({ error: "An error occurred while processing the signatory request" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { signatory_requestId: string } }) => {
  await connectToDatabase();

  try {
    await SignatoryRequests.findByIdAndDelete(params.signatory_requestId);
    return NextResponse.json({ message: "Signatory Request Rejected" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
