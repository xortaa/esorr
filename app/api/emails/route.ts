import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Email from "@/models/email";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    await connectToDatabase();
    const emails = await Email.find({ archived: { $ne: true } }).sort({ createdAt: -1 });
    return NextResponse.json(emails);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const emailData = Object.fromEntries(formData);

    const newEmail: any = new Email({
      subject: emailData.subject,
      text: emailData.text,
      scheduledDate: emailData.scheduledDate ? new Date(emailData.scheduledDate as string).toISOString() : null,
      recipientType: emailData.recipientType,
      affiliation: formData.get("affiliation") || null,
      specificRecipients: JSON.parse(emailData.specificRecipients as string),
      status: emailData.scheduledDate ? "scheduled" : "draft",
    });

    if (formData.get("attachment")) {
      const file = formData.get("attachment") as File;
      const buffer = await file.arrayBuffer();
      newEmail.attachment = {
        filename: file.name,
        content: Buffer.from(buffer),
      };
    }

    await newEmail.save();

    if (formData.get("sendImmediately") === "true") {
      await sendEmail(newEmail);
      newEmail.status = "sent";
      await newEmail.save();
    }

    return NextResponse.json({ success: true, message: "Email saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const emailData = Object.fromEntries(formData);

    const updatedEmail: any = {
      subject: emailData.subject,
      text: emailData.text,
      scheduledDate: emailData.scheduledDate ? new Date(emailData.scheduledDate as string).toISOString() : null,
      recipientType: emailData.recipientType,
      affiliation: formData.get("affiliation") || null,
      specificRecipients: JSON.parse(emailData.specificRecipients as string),
      status: emailData.scheduledDate ? "scheduled" : "draft",
    };

    if (formData.get("attachment")) {
      const file = formData.get("attachment") as File;
      const buffer = await file.arrayBuffer();
      updatedEmail.attachment = {
        filename: file.name,
        content: Buffer.from(buffer),
      };
    }

    const email = await Email.findByIdAndUpdate(emailData.id, updatedEmail, { new: true });

    if (formData.get("sendImmediately") === "true") {
      await sendEmail(email);
      email.status = "sent";
      await email.save();
    }

    return NextResponse.json({ success: true, message: "Email updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
