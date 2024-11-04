import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Pasoc from "@/models/pasoc";

export async function GET(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const { annexId } = params;
    const pasoc = await Pasoc.findOne({ annexe3: annexId });

    return NextResponse.json(pasoc || {});
  } catch (error) {
    console.error("Error fetching PASOC:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { annexId } = params;

    const updateData: any = {};

    // Prepare the update data
    for (const [key, value] of Object.entries(body)) {
      if (key === "furtherComments") {
        updateData[key] = value;
      } else if (typeof value === "object") {
        for (const [subKey, subValue] of Object.entries(value as object)) {
          updateData[`${key}.${subKey}`] = subValue;
        }
      }
    }

    console.log("Update data:", updateData);

    const pasoc = await Pasoc.findOneAndUpdate(
      { annexe3: annexId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!pasoc) {
      return NextResponse.json({ error: "PASOC not found" }, { status: 404 });
    }

    console.log("Updated PASOC:", pasoc);

    return NextResponse.json(pasoc);
  } catch (error) {
    console.error("Error updating PASOC:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
