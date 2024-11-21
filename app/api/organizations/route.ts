import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectToDatabase from "@/utils/mongodb";
import Organizations from "@/models/organization";
import User from "@/models/user";

export const maxDuration = 60;

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = {};

    switch (token.role) {
      case "RSO":
      case "RSO-SIGNATORY":
        if (!token.positions || token.positions.length === 0) {
          return NextResponse.json({ error: "No positions found" }, { status: 403 });
        }
        const orgIds = token.positions.map((pos) => pos.organization?._id).filter(Boolean);
        query = { _id: { $in: orgIds } };
        break;
      case "AU":
        if (!token.affiliation) {
          return NextResponse.json({ error: "No affiliation found" }, { status: 403 });
        }
        query = { affiliation: token.affiliation };
        break;
      case "SOCC":
      case "OSA":
        // No filter, can see all organizations
        break;
      default:
        return NextResponse.json({ error: "Unauthorized role" }, { status: 403 });
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
