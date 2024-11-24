import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import SubmissionAllowed from "@/models/submissionStatus";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const submissionAllowed = await SubmissionAllowed.findOne();

    // if submissionAllowed is not found, create a new one

    if (!submissionAllowed) {
      const newSubmissionAllowed = new SubmissionAllowed({ submissionAllowed: false });
      await newSubmissionAllowed.save();
      return NextResponse.json({ submissionStatus: newSubmissionAllowed }, { status: 200 });
    }

    // if submissionAllowed of submissionAllowed is true, set it to false and vice versa
    submissionAllowed.submissionAllowed = !submissionAllowed.submissionAllowed;

    const submissionStatus = await submissionAllowed.save();

    return NextResponse.json({ submissionStatus }, { status: 200 });
  } catch (error) {
    console.error("Error updating JSON file: ", error);
    return NextResponse.json({ error: "Failed to update submission status" }, { status: 500 });
  }
}
