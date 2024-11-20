import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA from "@/models/annex-a";

export async function PATCH(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();
  const { organizationSocials } = await req.json();

  if (!Array.isArray(organizationSocials)) {
    return NextResponse.json({ error: "Invalid socials data" }, { status: 400 });
  }

  try {
    const updatedAnnexA = await AnnexA.findByIdAndUpdate(
      params.annexId,
      { organizationSocials },
      { new: true, runValidators: true }
    );

    if (!updatedAnnexA) {
      return NextResponse.json({ error: "Annex A not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Organization socials updated", data: updatedAnnexA }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
