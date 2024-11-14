import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexC1 from "@/models/annex-c1";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const annexC1 = await AnnexC1.findById(params.annexId).populate("articlesOfAssociation").populate({
      path: "organization",
      select: "name",
    });

    if (!annexC1) {
      return NextResponse.json({ error: "Annex C1 not found" }, { status: 404 });
    }

    return NextResponse.json(annexC1, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};


export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body = await req.json();

    // Define allowed fields for update
    const allowedFields = [
      "isSubmitted",
      "president",
      "vicePresident",
      "secretary",
      "treasurer",
      "auditor",
      "peaceRelationsOfficer",
      "adviser",
      "comelecRepresentative",
      "pdf",
    ];

    // Filter out any fields that are not allowed
    const updateData = Object.keys(body).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = body[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // If there's nothing to update, return an error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // If isSubmitted is being set to true, add the current date
    if (updateData.isSubmitted === true) {
      updateData.dateSubmitted = new Date();
    }

    const updatedAnnexC1 = await AnnexC1.findByIdAndUpdate(
      params.annexId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("articlesOfAssociation")
      .populate({
        path: "organization",
        select: "name",
      });

    if (!updatedAnnexC1) {
      return NextResponse.json({ error: "Annex C1 not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnexC1, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};