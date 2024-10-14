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
  affiliation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Incomplete", "Inactive", "For Revision"],
    default: "Incomplete",
  },
  annexA: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexA",
    },
  ],
});

const Organization = models.Organization || model("Organization", OrganizationSchema);

export default Organization;
