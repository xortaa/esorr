// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-g\[annexId]\nominee\route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexG from "@/models/annex-g";
import Nominee from "@/models/nominee";
import AnnexA from "@/models/annex-a";

export async function GET(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const annexG = await AnnexG.findById(params.annexId).populate("nominees");
    return NextResponse.json({ nominees: annexG.nominees }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { name, faculty, email, landline, mobile, cv, officeAddress1, officeAddress2, signature } = body;

    const nominee = new Nominee({
      name,
      faculty,
      email,
      landline,
      mobile,
      cv,
      officeAddress1,
      officeAddress2,
      signature,
      organization: params.organizationId,
    });

    await nominee.save();

    // Add the nominee to the AnnexG document
    const annexG = await AnnexG.findByIdAndUpdate(params.annexId, { $push: { nominees: nominee._id } }, { new: true });

    const annexA = await AnnexA.findOne({
      academicYear: annexG.academicYear,
      organization: params.organizationId,
    });

    annexA.advisers.push(nominee._id);
    await annexA.save();

    return NextResponse.json(nominee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}