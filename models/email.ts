import { Schema, model, models } from "mongoose";

const EmailSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
    },
    recipientType: {
      type: String,
      enum: ["allRSO", "affiliationRSO", "specificRSO"],
      required: true,
    },
    affiliation: {
      type: String,
    },
    specificRecipients: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "scheduled", "sent"],
      default: "draft",
    },
    attachment: {
      filename: String,
      content: Buffer,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Email = models.Email || model("Email", EmailSchema);

export default Email;
