import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA from "@/models/annex-a";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexA = await AnnexA.findById(params.annexId)
      .populate("officers advisers")
      .populate({
        path: "organization",
        select: "name affilation",
      })
      .populate({
        path: "officers",
        select: "firstName middleName lastName position affiliation mobileNumber email gwa signature",
      })
      .populate({
        path: "outflows",
        populate: {
          path: "event",
          select: "title",
        },
      });
    return NextResponse.json(annexA, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();
    const {
      outgoingSecretary,
      incomingSecretary,
      outgoingTreasurer,
      incomingTreasurer,
      outgoingPresident,
      incomingPresident,
    } = body;

    const updateData: any = {};

    if (outgoingSecretary) updateData.outgoingSecretary = outgoingSecretary;
    if (incomingSecretary) updateData.incomingSecretary = incomingSecretary;
    if (outgoingTreasurer) updateData.outgoingTreasurer = outgoingTreasurer;
    if (incomingTreasurer) updateData.incomingTreasurer = incomingTreasurer;
    if (outgoingPresident) updateData.outgoingPresident = outgoingPresident;
    if (incomingPresident) updateData.incomingPresident = incomingPresident;

    const updatedAnnexA = await AnnexA.findByIdAndUpdate(
      params.annexId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("officers advisers")
      .populate({
        path: "organization",
        select: "name affilation",
      })
      .populate({
        path: "officers",
        select: "firstName middleName lastName position affiliation mobileNumber email gwa signature",
      })
      .populate({
        path: "outflows",
        populate: {
          path: "event",
          select: "title",
        },
      });

    if (!updatedAnnexA) {
      return NextResponse.json({ error: "Annex A not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexA, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating Annex A" }, { status: 500 });
  }
};
