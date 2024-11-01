import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import AnnexE2 from "@/models/annex-e2";
import Outflow from "@/models/outflow";

export async function PUT(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string; itemId: string } }
) {
  try {
    await connectToDatabase();
    const { organizationId, annexId, outflowId, itemId } = params;
    const updatedItem = await request.json();

    const outflow = await Outflow.findById(outflowId);
    if (!outflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    const itemIndex = outflow.items.findIndex((item: any) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    outflow.items[itemIndex] = { ...outflow.items[itemIndex], ...updatedItem };
    await outflow.save();

    return NextResponse.json(outflow.items[itemIndex]);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { organizationId: string; annexId: string; outflowId: string; itemId: string } }
) {
  try {
    await connectToDatabase();
    const { organizationId, annexId, outflowId, itemId } = params;

    const outflow = await Outflow.findById(outflowId);
    if (!outflow) {
      return NextResponse.json({ error: "Outflow not found" }, { status: 404 });
    }

    outflow.items = outflow.items.filter((item: any) => item._id.toString() !== itemId);
    await outflow.save();

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
