import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const recipients = JSON.parse(formData.get("recipients") as string);
    const attachment = formData.get("attachment") as File | null;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "osatesteresorr@gmail.com",
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: '"Office for Student Affairs" <osatester@gmail.com>',
      to: recipients.join(", "),
      subject,
      text,
    };

    if (attachment) {
      const buffer = await attachment.arrayBuffer();
      mailOptions.attachments = [
        {
          filename: attachment.name,
          content: Buffer.from(buffer),
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Email sent: ${info.messageId}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
