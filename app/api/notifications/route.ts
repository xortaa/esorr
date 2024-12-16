import connectToDatabase from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notification";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const notifications = await Notification.find().sort({ date: -1 }).lean();

    // Set cache control headers
    const headers = new Headers();
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return NextResponse.json(notifications, {
      headers: headers,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
