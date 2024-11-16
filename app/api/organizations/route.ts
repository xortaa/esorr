import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organizations from "@/models/organization";
export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const organizations = await Organizations.find({});
    return NextResponse.json(organizations, { status: 200 });
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
