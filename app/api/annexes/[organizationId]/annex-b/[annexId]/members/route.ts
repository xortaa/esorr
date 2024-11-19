import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexB from "@/models/annex-b";
import Member from "@/models/member";
import AnnexA from "@/models/annex-a";

export async function GET(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();

    const annexB = await AnnexB.findById(params.annexId).populate("members");

    if (!annexB) {
      return NextResponse.json({ error: "Annex B not found" }, { status: 404 });
    }

    return NextResponse.json(annexB.members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();

    const memberData = await req.json();
    console.log("Received member data:", memberData);

    const newMember = new Member(memberData);
    await newMember.save();

    const annexB = await AnnexB.findById(params.annexId);
    if (!annexB) {
      return NextResponse.json({ error: "Annex B not found" }, { status: 404 });
    }

    annexB.members.push(newMember._id);
    await annexB.save();
    await annexB.updateMemberCounts();

    const annexA = await AnnexA.findOne({ academicYear: annexB.academicYear, organization: params.organizationId });

    if (annexA) {
      annexA.members.push(newMember._id);
      await annexA.save();
    }

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
