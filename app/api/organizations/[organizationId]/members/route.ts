import Members from "@/models/member";
import { NextRequest, NextResponse } from "next/server";
import { Member, MemberInput } from "@/types";
import connectToDatabase from "@/utils/mongodb";
import Organization from "@/models/organization";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const members: Member[] = await Members.find({ organization: params.organizationId });
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  const memberInput: MemberInput = await req.json();

  try {
    const newMember = await Members.create({ ...memberInput, organization: params.organizationId });
    await Organization.findByIdAndUpdate(params.organizationId, { $push: { members: newMember._id } });
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
