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
    required: [true, "is_univ_wide is required"],
  },
  website: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  socials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Social"
    }
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
});

const Organization = models.Organization || model("Organization", OrganizationSchema);

export default Organization;
