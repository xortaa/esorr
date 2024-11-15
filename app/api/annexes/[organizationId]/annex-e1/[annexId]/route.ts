import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE1 from "@/models/annex-e1";
import AnnexE2 from "@/models/annex-e2";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexE1 = await AnnexE1.findById(params.annexId)
      .populate({
        path: "organization",
        select: "name",
      })
      .populate("financialReport");

    const annexE2 = await AnnexE2.findOne({
      academicYear: annexE1.academicYear,
      organization: annexE1.organization,
    }).populate({
      path: "january.inflows january.outflows february.inflows february.outflows march.inflows march.outflows april.inflows april.outflows may.inflows may.outflows june.inflows june.outflows july.inflows july.outflows august.inflows august.outflows september.inflows september.outflows october.inflows october.outflows november.inflows november.outflows december.inflows december.outflows",
    });

    return NextResponse.json({ annexE1, annexE2 }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { isSubmitted, ...signatureData } = body;

    let updateData: any = {};

    if (isSubmitted !== undefined) {
      updateData.isSubmitted = isSubmitted;
    }

    if (Object.keys(signatureData).length > 0) {
      const signaturePosition = Object.keys(signatureData)[0];
      updateData[signaturePosition] = {
        ...signatureData[signaturePosition],
        dateSigned: new Date(),
      };
    }

    const updatedAnnexE1 = await AnnexE1.findByIdAndUpdate(params.annexId, { $set: updateData }, { new: true })
      .populate({
        path: "organization",
        select: "name",
      })
      .populate("financialReport");

    if (!updatedAnnexE1) {
      return NextResponse.json({ error: "Annex E1 not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexE1, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
