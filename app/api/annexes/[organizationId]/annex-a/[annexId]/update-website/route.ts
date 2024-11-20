import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA from "@/models/annex-a";

export async function PATCH(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();
  const { officialWebsite } = await req.json();

  if (typeof officialWebsite !== "string") {
    return NextResponse.json({ error: "Invalid website data" }, { status: 400 });
  }

  try {
    const updatedAnnexA = await AnnexA.findByIdAndUpdate(
      params.annexId,
      { officialWebsite },
      { new: true, runValidators: true }
    );

    if (!updatedAnnexA) {
      return NextResponse.json({ error: "Annex A not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Official website updated", data: updatedAnnexA }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
