import Organization from "@/models/organization";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export const GET = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const organization = await Organization.findById(params.organizationId).lean();

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // @ts-ignore
    const currentAcademicYear = organization.academicYear;

    const annexTypes = [
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

    for (const annexType of annexTypes) {
      if (organization[annexType] && organization[annexType].length > 0) {
        const populatedAnnex = await Organization.populate(organization, {
          path: annexType,
          match: { academicYear: currentAcademicYear },
        });
        organization[annexType] = populatedAnnex[annexType];
      }
    }

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  const organizationInput = await req.json();

  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(params.organizationId, organizationInput, {
      new: true,
    });
    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { organizationId: string } }) => {
  await connectToDatabase();

  try {
    const organization = await Organization.findByIdAndDelete(params.organizationId);
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
