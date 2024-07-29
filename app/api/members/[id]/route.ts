import { MembersInput, Members } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/member";
import dbConnect from "@/db/mongodb";

export const GET = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  await dbConnect();
  try {
    const member: Members = await Member.findById(id);
    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const id = params.id;
  try {
    await dbConnect();
    const membersInput: MembersInput = await req.json();
    const member = await Member.findByIdAndUpdate(id, membersInput, { new: true });
    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const id = params.id;
  try {
    const deletedMember = await Member.findByIdAndDelete(id);
    return NextResponse.json(deletedMember, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
