import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { to, subject, text } = await request.json();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'osatesteresorr@gmail.com',
                pass: 'zkdr sqmi lwau ftih',
            },
        });

        const info = await transporter.sendMail({
            from: '"Office for Student Affairs" <osatester@gmail.com>',
            to,
            subject,
            text,
        });

        return NextResponse.json({
            success: true,
            message: `Email sent: ${info.messageId}`,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
