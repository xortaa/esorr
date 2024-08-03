import { Member, MemberInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import Members from "@/models/member";
import dbConnect from "@/db/mongodb";

export const GET = async () => {
  await dbConnect();
  try {
    const members: Member[] = await Members.find({}).populate("educational_background");
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await dbConnect();

  let memberInput: MemberInput;
  try {
    memberInput = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    const newMember = await Members.create(memberInput);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
