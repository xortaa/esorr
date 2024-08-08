import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  image: {
    type: String,
  },
  affiliation: {
    type: String,
  },
  is_univ_wide: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
  },
  email: {
    type: String,
  },
  socials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Socials",
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  advisers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  accreditation_code: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["For Revision", "Ready for Printing"],
    default: "For Revision",
  },
});

const Organization = models.Organization || model("Organization", OrganizationSchema);

export default Organization;
