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
  socials: {
    type: [String],
    default: [],
  },
  website: {
    type: String,
  },
    strategicDirectionalAreas: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
  },
  signatories: [
    {
      type: Schema.Types.ObjectId,
      ref: "RsoSignatory",
    },
  ],
  mission: {
    type: String,
  },
  vision: {
    type: String,
  },
  description: {
    type: String,
  },
  objectives: [
    {
      type: String,
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
});

const Organization = models.Organization || model("Organization", OrganizationSchema);

export default Organization;
