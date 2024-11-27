import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectToDatabase from "@/utils/mongodb";
import Organizations from "@/models/organization";

export const maxDuration = 60;

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token.role === "RSO") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let query = {};

    if (token.role === "AU") {
      query = { affiliation: token.affiliation };
    }

    const organizations = await Organizations.find(query).populate(
      "annex01 annex02 annexA annexA1 annexB annexC annexC1 annexD annexE annexE1 annexF annexG annexH annexI annexJ annexK annexL"
    );

    const processedOrganizations = organizations.map((org) => {
      const annexes = [
        "annex01",
        "annex02",
        "annexA",
        "annexA1",
        "annexB",
        "annexC",
        "annexC1",
        "annexD",
        "annexE",
        "annexE1",
        "annexE2",
        "annexE3",
        "annexF",
        "annexG",
        "annexH",
        "annexI",
        "annexJ",
        "annexK",
        "annexL",
      ];

      const relevantAnnexes = annexes.flatMap((annex) => org[annex].filter((a) => a.academicYear === org.academicYear));

      let status = "Completed";
      if (relevantAnnexes.some((annex) => annex.status === "For Review")) {
        status = "For Review";
      } else if (relevantAnnexes.some((annex) => annex.status !== "Approved")) {
        status = "Incomplete";
      }

      return {
        ...org.toObject(),
        calculatedStatus: status,
      };
    });

    return NextResponse.json(processedOrganizations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await connectToDatabase();

  const organizationInput = await req.json();

  try {
    const newOrganization = await Organizations.create(organizationInput);
    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
