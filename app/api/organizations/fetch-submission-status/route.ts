import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), "/public/submission.json");

  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error reading JSON file: ", error);
    return NextResponse.json({ error: "Failed to read submission status" }, { status: 500 });
  }
}
