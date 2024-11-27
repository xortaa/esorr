import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexC from "@/models/annex-c";

type SignatureField = {
  name: string;
  position: string;
  signatureUrl: string;
  dateSigned?: string | Date;
};

type AnnexCUpdateBody = {
  ratificationDate?: string | Date;
  ratificationVenue?: string;
  secretaryRatificationVenue?: string;
  isSubmitted?: boolean;
  secretary?: SignatureField;
  president?: SignatureField;
};

type SignatureKeys = "secretary" | "president";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  const annexC = await AnnexC.findById(params.annexId).populate({
    path: "organization",
    select: "name affiliation"
  });

  if (!annexC) {
    return NextResponse.json({ error: "Annex C not found" }, { status: 404 });
  }

  return NextResponse.json(annexC, { status: 200 });
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) => {
  await connectToDatabase();

  try {
    const body: AnnexCUpdateBody = await req.json();
    const { ratificationDate, ratificationVenue, secretaryRatificationVenue, isSubmitted, ...signatureFields } = body;

    const updateFields: Partial<AnnexCUpdateBody> = {};

    if (ratificationDate) updateFields.ratificationDate = new Date(ratificationDate);
    if (ratificationVenue) updateFields.ratificationVenue = ratificationVenue;
    if (secretaryRatificationVenue) updateFields.secretaryRatificationVenue = secretaryRatificationVenue;
    if (isSubmitted !== undefined) updateFields.isSubmitted = isSubmitted;

    // Handle signature fields
    (Object.entries(signatureFields) as [SignatureKeys, SignatureField][]).forEach(([key, value]) => {
      if (value && typeof value === "object") {
        updateFields[key] = {
          name: value.name,
          position: value.position,
          signatureUrl: value.signatureUrl,
          dateSigned: value.dateSigned ? new Date(value.dateSigned) : undefined,
        };
      }
    });

    const updatedAnnexC = await AnnexC.findByIdAndUpdate(
      params.annexId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("organization");

    return NextResponse.json(updatedAnnexC, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
