import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexB from "@/models/annex-b";

export async function GET(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();

    const annexB = await AnnexB.findById(params.annexId);

    if (!annexB) {
      return NextResponse.json({ error: "Annex B not found" }, { status: 404 });
    }

    await annexB.updateMemberCounts();

    const statistics = {
      numberOfOfficers: annexB.numberOfOfficers,
      maleMembersBelow18: annexB.maleMembersBelow18,
      maleMembers18To20: annexB.maleMembers18To20,
      maleMembers21AndAbove: annexB.maleMembers21AndAbove,
      femaleMembersBelow18: annexB.femaleMembersBelow18,
      femaleMembers18To20: annexB.femaleMembers18To20,
      femaleMembers21AndAbove: annexB.femaleMembers21AndAbove,
      memberDistribution: annexB.memberDistribution,
      totalMembers: annexB.totalMembers,
      totalOfficersAndMembers: annexB.totalOfficersAndMembers,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching Annex B statistics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
