import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Email from "@/models/email";
import User from "@/models/user";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "osatesteresorr@gmail.com",
    pass: "zkdr sqmi lwau ftih",
  },
});

async function sendEmail(email: any) {
  const recipients = await getRecipients(email.recipientType, email.affiliation, email.specificRecipients);

  const mailOptions: nodemailer.SendMailOptions = {
    from: '"Office for Student Affairs" <osatester@gmail.com>',
    to: recipients.join(", "),
    subject: email.subject,
    text: email.text,
  };

  if (email.attachment) {
    mailOptions.attachments = [
      {
        filename: email.attachment.filename,
        content: email.attachment.content,
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
}

async function getRecipients(recipientType: string, affiliation: string | null, specificRecipients: string[] | null) {
  let recipients: string[] = [];

  switch (recipientType) {
    case "allRSO":
      recipients = await User.find({ role: "RSO" }).distinct("email");
      break;
    case "affiliationRSO":
      if (affiliation === "university-wide") {
        recipients = await User.find({ role: "RSO", affiliation: "University Wide" }).distinct("email");
      } else {
        recipients = await User.find({ role: "RSO", affiliation: affiliation }).distinct("email");
      }
      break;
    case "specificRSO":
      recipients = specificRecipients || [];
      break;
  }

  return recipients;
}

export async function GET() {
  try {
    await connectToDatabase();
    const now = new Date();
    const scheduledEmails = await Email.find({
      status: "scheduled",
      scheduledDate: { $lte: now },
    });

    for (const email of scheduledEmails) {
      try {
        await sendEmail(email);
        email.status = "sent";
        await email.save();
      } catch (error) {
        console.error(`Failed to send email ${email._id}:`, error);
      }
    }

    return NextResponse.json({ success: true, message: "Scheduled emails processed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
