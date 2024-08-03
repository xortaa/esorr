import { Schema, model, models } from "mongoose";

const MemberModel = new Schema({
  first_name: {
    type: String,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  position: {
    type: String,
  },
  college: {
    type: String,
  },
  student_number: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  address: {
    type: String,
  },
  other_organizations: [
    {
      name: { type: Schema.Types.ObjectId, ref: "Organization" },
      position: { type: String },
      inclusive_date: { type: String },
    },
  ],
  religion: {
    type: String,
  },
  citizenship: {
    type: String,
  },
  gender: {
    type: String,
  },
  educational_background: [
    {
      type: Schema.Types.ObjectId,
      ref: "EducationalBackground",
    },
  ],
  is_new_member: {
    type: Boolean,
    default: true,
  },
  program: {
    type: String,
  },
  year_level: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Member = models.Member || model("Member", MemberModel);

export default Member;
