import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
  },
  socials: [
    {
      name: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
  signatories: [
    {
      type: Schema.Types.ObjectId,
      ref: "RsoSignatory",
    },
  ],
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
});

const Organization = models.Organization || model("Organization", OrganizationSchema);

export default Organization;
