import nodemailer from "nodemailer";
import User from "@/models/user";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "osatesteresorr@gmail.com",
    pass: "zkdr sqmi lwau ftih",
  },
});

export async function sendEmail(email: any) {
  const recipients = await getRecipients(email.recipientType, email.affiliation, email.specificRecipients);

  const mailOptions: nodemailer.SendMailOptions = {
    from: '"Office for Student Affairs" <osatester@gmail.com>',
    to: recipients.join(", "),
    subject: email.subject,
    text: email.text,
  };

  if (email.attachment && email.attachment.filename && email.attachment.content) {
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
