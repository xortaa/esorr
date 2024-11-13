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
    return NextResponse.json(annexC1, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
