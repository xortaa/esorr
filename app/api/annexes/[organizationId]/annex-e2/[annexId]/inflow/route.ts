import { NextResponse } from "next/server";
import  connectToDatabase  from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import Inflow from "@/models/inflow";

export async function GET(request: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const annex = await AnnexE2.findById(params.annexId).populate("inflow");
    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }
    return NextResponse.json(annex.inflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newInflow = new Inflow(body);
    await newInflow.save();

    const annex = await AnnexE2.findById(params.annexId);
    if (!annex) {
      return NextResponse.json({ error: "Annex not found" }, { status: 404 });
    }

    annex.inflow.push(newInflow._id);
    await annex.save();

    return NextResponse.json(newInflow, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
