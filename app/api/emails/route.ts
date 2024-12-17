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

    const newEmail = new Email({
      subject: emailData.subject,
      text: emailData.text,
      scheduledDate:
        emailData.scheduledDate && typeof emailData.scheduledDate === "string"
          ? new Date(emailData.scheduledDate)
          : null,
      recipientType: emailData.recipientType,
      affiliation: formData.get("affiliation") || null,
      specificRecipients: JSON.parse((emailData.specificRecipients as string) || "[]"),
      status: emailData.scheduledDate ? "scheduled" : "draft",
    });

    const attachmentFile = formData.get("attachment");
    if (attachmentFile instanceof File && attachmentFile.size > 0) {
      const buffer = await attachmentFile.arrayBuffer();
      newEmail.attachment = {
        filename: attachmentFile.name,
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
    console.error("Error processing email:", error);
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
      scheduledDate:
        emailData.scheduledDate && typeof emailData.scheduledDate === "string"
          ? new Date(emailData.scheduledDate)
          : null,
      recipientType: emailData.recipientType,
      affiliation: formData.get("affiliation") || null,
      specificRecipients: JSON.parse((emailData.specificRecipients as string) || "[]"),
      status: emailData.scheduledDate ? "scheduled" : "draft",
    };

    const attachmentFile = formData.get("attachment");
    if (attachmentFile instanceof File && attachmentFile.size > 0) {
      const buffer = await attachmentFile.arrayBuffer();
      updatedEmail.attachment = {
        filename: attachmentFile.name,
        content: Buffer.from(buffer),
      };
    } else if (attachmentFile === "null") {
      updatedEmail.attachment = { filename: null, content: null };
    }

    const email = await Email.findByIdAndUpdate(emailData._id, updatedEmail, { new: true });

    if (!email) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }

    if (formData.get("sendImmediately") === "true") {
      await sendEmail(email);
      email.status = "sent";
      await email.save();
    }

    return NextResponse.json({ success: true, message: "Email updated successfully" });
  } catch (error: any) {
    console.error("Error processing email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
