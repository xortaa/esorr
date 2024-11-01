import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import Outflow from "@/models/outflow";

export async function GET(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string } }
) {
  try {
    await connectToDatabase();
    const outflow = await Outflow.findById(params.outflowId);
    if (!outflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }
    return NextResponse.json(outflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const updatedOutflow = await Outflow.findByIdAndUpdate(params.outflowId, body, { new: true });
    if (!updatedOutflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }
    return NextResponse.json(updatedOutflow);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string } }
) {
  try {
    await connectToDatabase();
    const deletedOutflow = await Outflow.findById(params.outflowId);
    if (!deletedOutflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    if (deletedOutflow.image) {
      const fileName = deletedOutflow.image.split("/").pop();
      if (fileName) {
        try {
          const deleteResponse = await fetch("/api/delete-file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName }),
          });

          if (!deleteResponse.ok) {
            console.error("Failed to delete file:", await deleteResponse.text());
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          // Continue with outflow deletion even if file deletion fails
        }
      }
    }

    await Outflow.findByIdAndDelete(params.outflowId);
    await AnnexE2.findByIdAndUpdate(params.annexId, {
      $pull: { outflow: params.outflowId },
    });

    return NextResponse.json({ message: "Outflow deleted successfully" });
  } catch (error) {
    console.error("Error deleting outflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}