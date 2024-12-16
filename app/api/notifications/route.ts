import connectToDatabase from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notification";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const notifications = await Notification.find().sort({ date: -1 });

    // Set cache control headers
    const headers = new Headers();
    headers.set("Cache-Control", "no-store, max-age=0");

    return NextResponse.json(notifications, {
      headers: headers,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
