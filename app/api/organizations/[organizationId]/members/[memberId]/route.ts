import Members from "@/models/member";
import { Member, MemberInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organizations from "@/models/organization";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; memberId: string } }) => {
  await connectToDatabase();

  try {
    const member: Member = await Members.findById(params.memberId);
    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; memberId: string } }) => {
  await connectToDatabase();

  const memberInput: MemberInput = await req.json();

  try {
    const updatedMember = await Members.findByIdAndUpdate(params.memberId, memberInput, { new: true });
    return NextResponse.json(updatedMember, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { organizationId: string; memberId: string } }
) => {
  await connectToDatabase();

  try {
    const deletedMember = await Members.findByIdAndDelete(params.memberId);
    await Organizations.findByIdAndUpdate(params.organizationId, {
      $pull: { members: params.memberId },
    });
    return NextResponse.json(deletedMember, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
