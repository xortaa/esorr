import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA1 from "@/models/annex-a1";
import Officer from "@/models/officer";

export async function GET(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; officerId: string } }
) {
  await connectToDatabase();

  try {
    const { organizationId, annexId, officerId } = params;

    const officer = await Officer.findOne({
      _id: officerId,
      organization: organizationId,
    });

    if (!officer) {
      return NextResponse.json({ error: "Officer not found" }, { status: 404 });
    }

    return NextResponse.json(officer);
  } catch (error) {
    console.error("Error fetching officer:", error);
    return NextResponse.json({ error: "An error occurred while fetching the officer" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; officerId: string } }
) {
  await connectToDatabase();

  try {
    const { organizationId, annexId, officerId } = params;
    const data = await req.json();

    const officer = await Officer.findOneAndUpdate(
      { _id: officerId, organization: organizationId },
      { $set: data },
      { new: true }
    );

    if (!officer) {
      return NextResponse.json({ error: "Officer not found" }, { status: 404 });
    }

    return NextResponse.json(officer);
  } catch (error) {
    console.error("Error updating officer:", error);
    return NextResponse.json({ error: "An error occurred while updating the officer" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; officerId: string } }
) {
  await connectToDatabase();

  try {
    const { organizationId, annexId, officerId } = params;

    const officer = await Officer.findOneAndDelete({
      _id: officerId,
      organization: organizationId,
    });

    if (!officer) {
      return NextResponse.json({ error: "Officer not found" }, { status: 404 });
    }

    // Remove the officer from the annex
    await AnnexA1.findOneAndUpdate({ _id: annexId, organization: organizationId }, { $pull: { officers: officerId } });

    return NextResponse.json({ message: "Officer deleted successfully" });
  } catch (error) {
    console.error("Error deleting officer:", error);
    return NextResponse.json({ error: "An error occurred while deleting the officer" }, { status: 500 });
  }
}
