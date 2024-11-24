import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SubmissionAllowed from "@/models/submissionStatus";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const submissionAllowed = await SubmissionAllowed.findOne();

    if (!submissionAllowed) {
      const newSubmissionAllowed = new SubmissionAllowed({ submissionAllowed: true });
      await newSubmissionAllowed.save();
      return NextResponse.json({ submissionAllowed: newSubmissionAllowed }, { status: 200 });
    }

    return NextResponse.json(submissionAllowed, { status: 200 });
  } catch (error) {
    console.error("Error reading JSON file: ", error);
    return NextResponse.json({ error: "Failed to read submission status" }, { status: 500 });
  }
}
