import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const annexId = formData.get("annexId") as string;
    const position = formData.get("position") as string;

    if (!file || !annexId || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${annexId}_${position}_${Date.now()}${file.name.substring(file.name.lastIndexOf("."))}`;
    const directoryPath = join(process.cwd(), "public", "signatures");
    const filePath = join(directoryPath, filename);

    // Create the directory if it doesn't exist
    await mkdir(directoryPath, { recursive: true });

    await writeFile(filePath, new Uint8Array(buffer));

    return NextResponse.json({ filename });
  } catch (error) {
    console.error("Error saving signature:", error);
    return NextResponse.json({ error: "Error saving signature" }, { status: 500 });
  }
}
