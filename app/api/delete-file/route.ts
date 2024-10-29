import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/utils/deleteFile";

export async function POST(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    await deleteFile(fileName);

    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
