import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
  const filePath = path.join(process.cwd(), "/public/submission.json");

  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    data.submissionAllowed = !data.submissionAllowed;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating JSON file: ", error);
    return NextResponse.json({ error: "Failed to update submission status" }, { status: 500 });
  }
}
