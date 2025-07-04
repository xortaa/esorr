import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexC from "@/models/annex-c";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const annexC = await AnnexC.find({ organization: params.organizationId }).populate({
      path: "organization",
      select: "name affiliation",
    });
    return NextResponse.json(annexC, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
