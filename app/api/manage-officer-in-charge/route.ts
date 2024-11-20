import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import OfficerInCharge from "@/models/officer-in-charge";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const officerInCharge = await OfficerInCharge.findOne();
    if (!officerInCharge) {
      return NextResponse.json({ message: "No Officer-In-Charge found" }, { status: 404 });
    }
    return NextResponse.json(officerInCharge, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await connectToDatabase();

  const body = await req.json();

  try {
    const existingOfficer = await OfficerInCharge.findOne();
    if (existingOfficer) {
      existingOfficer.name = body.name;
      await existingOfficer.save();
      return NextResponse.json(existingOfficer, { status: 200 });
    } else {
      const newOfficer = await OfficerInCharge.create(body);
      return NextResponse.json(newOfficer, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  await connectToDatabase();

  const body = await req.json();

  try {
    const officerInCharge = await OfficerInCharge.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(officerInCharge, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error has occurred" }, { status: 500 });
  }
};
