import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexB from "@/models/annex-b";
import Member from "@/models/member";
import AnnexA from "@/models/annex-a";

export async function GET(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; memberId: string } }
) {
  try {
    await connectToDatabase();

    const member = await Member.findById(params.memberId);

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; memberId: string } }
) {
  try {
    await connectToDatabase();

    const memberData = await req.json();
    const updatedMember = await Member.findByIdAndUpdate(params.memberId, memberData, { new: true });

    if (!updatedMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const annexB = await AnnexB.findById(params.annexId);
    if (annexB) {
      await annexB.updateMemberCounts();
    }

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; memberId: string } }
) {
  try {
    await connectToDatabase();

    const deletedMember = await Member.findByIdAndDelete(params.memberId);

    if (!deletedMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const annexB = await AnnexB.findByIdAndUpdate(params.annexId, { $pull: { members: params.memberId } });
    if (annexB) {
      await annexB.updateMemberCounts();
    }

    const annexA = await AnnexA.findOne({ academicYear: annexB.academicYear, organization: params.organizationId });

    if (annexA) {
      await AnnexA.findByIdAndUpdate(annexA._id, { $pull: { members: params.memberId } });
    }

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
