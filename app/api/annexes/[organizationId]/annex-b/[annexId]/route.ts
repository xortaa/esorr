import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexB from "@/models/annex-b";
import Member from "@/models/member";

export async function GET(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();

    const annexB = await AnnexB.findById(params.annexId).populate("organization members");

    if (!annexB) {
      return NextResponse.json({ error: "Annex B not found" }, { status: 404 });
    }

    return NextResponse.json(annexB);
  } catch (error) {
    console.error("Error fetching Annex B:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();

    const annexBData = await req.json();
    const updatedAnnexB = await AnnexB.findByIdAndUpdate(params.annexId, annexBData, { new: true });

    if (!updatedAnnexB) {
      return NextResponse.json({ error: "Annex B not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexB);
  } catch (error) {
    console.error("Error updating Annex B:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();

    const deletedAnnexB = await AnnexB.findByIdAndDelete(params.annexId);

    if (!deletedAnnexB) {
      return NextResponse.json({ error: "Annex B not found" }, { status: 404 });
    }

    // Delete all associated members
    await Member.deleteMany({ _id: { $in: deletedAnnexB.members } });

    return NextResponse.json({ message: "Annex B and associated members deleted successfully" });
  } catch (error) {
    console.error("Error deleting Annex B:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
