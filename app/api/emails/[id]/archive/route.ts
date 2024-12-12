import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Email from "@/models/email";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const email = await Email.findByIdAndUpdate(params.id, { archived: true }, { new: true });
    if (!email) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Email archived successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
