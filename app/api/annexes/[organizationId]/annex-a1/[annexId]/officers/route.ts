import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexA1 from "@/models/annex-a1";
import Officer from "@/models/officer";
import AnnexA from "@/models/annex-a";

export async function GET(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const { organizationId, annexId } = params;
    console.log("GET request received with params:", { organizationId, annexId });

    const annex = await AnnexA1.findOne({
      _id: annexId,
      organization: organizationId,
    }).populate("officers");

    if (!annex) {
      console.error("Annex not found:", { organizationId, annexId });
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    return NextResponse.json(annex.officers);
  } catch (error) {
    console.error("Error fetching officers:", error);
    return NextResponse.json({ error: "An error occurred while fetching officers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const { organizationId, annexId } = params;
    console.log("POST request received with params:", { organizationId, annexId });

    const data = await req.json();
    console.log("Data received in POST request:", data);

    const annex = await AnnexA1.findOne({
      _id: annexId,
      organization: organizationId,
    });

    if (!annex) {
      console.error("Annex not found:", { organizationId, annexId });
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    // Ensure that educationalBackground and recordOfExtraCurricularActivities are included in the officer data
    const newOfficer = await Officer.create({
      ...data,
      organization: organizationId,
      educationalBackground: data.educationalBackground || [],
      recordOfExtraCurricularActivities: data.recordOfExtraCurricularActivities || [],
    });

    // Add the officer to AnnexA1 only if it's not already there
    if (!annex.officers.includes(newOfficer._id)) {
      annex.officers.push(newOfficer._id);
      await annex.save();
    }

    // Find the corresponding AnnexA document and add the officer there as well
    const annexA = await AnnexA.findOne({
      academicYear: annex.academicYear,
      organization: organizationId,
    });

    if (annexA && !annexA.officers.includes(newOfficer._id)) {
      annexA.officers.push(newOfficer._id);
      await annexA.save();
    } else if (!annexA) {
      console.warn("AnnexA not found for the given academic year and organization");
    }

    console.log("New officer created and added to annex:", newOfficer);
    return NextResponse.json(newOfficer, { status: 201 });
  } catch (error) {
    console.error("Error creating officer:", error);
    return NextResponse.json({ error: "An error occurred while creating the officer" }, { status: 500 });
  }
}