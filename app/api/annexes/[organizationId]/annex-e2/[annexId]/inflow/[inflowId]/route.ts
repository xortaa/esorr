import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import Inflow from "@/models/inflow";

export async function GET(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; inflowId: string } }
) {
  try {
    await connectToDatabase();
    const inflow = await Inflow.findById(params.inflowId);
    if (!inflow) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }
    return NextResponse.json(inflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; inflowId: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const updatedInflow = await Inflow.findByIdAndUpdate(params.inflowId, body, { new: true });
    if (!updatedInflow) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }
    return NextResponse.json(updatedInflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; inflowId: string } }
) {
  try {
    await connectToDatabase();
    const deletedInflow = await Inflow.findByIdAndDelete(params.inflowId);
    if (!deletedInflow) {
      return NextResponse.json({ error: "Inflow not found" }, { status: 404 });
    }

    await AnnexE2.findByIdAndUpdate(params.annexId, {
      $pull: { inflow: params.inflowId },
    });

    return NextResponse.json({ message: "Inflow deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
