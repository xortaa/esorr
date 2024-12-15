import connectToDatabase from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notification";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const notifications = await Notification.find().sort({ date: -1 });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
