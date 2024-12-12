import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Email from "@/models/email";
import { ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const email = await Email.findById(new ObjectId(params.id));
    if (!email) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }
    return NextResponse.json(email);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
