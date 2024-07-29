import { MembersInput, Members } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/member";
import dbConnect from "@/db/mongodb";

// @desc get all members
// @route GET /api/members
// @access Private
export const GET = async () => {
  await dbConnect();
  try {
    const members: Members[] = await Member.find({});
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

// @desc create a member
// @route POST /api/members
// @access Private
// @req body MembersInput
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const membersInput: MembersInput = await req.json();
    const newMember = await Member.create(membersInput);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

