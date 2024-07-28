import { Schema, model, models } from "mongoose";

const MemberModel = new Schema({
  first_name: {
    type: String,
    required: [true, "first_name is required"],
  },
  middle_name: {
    type: String,
    required: [true, "middle_name is required"],
  },
  last_name: {
    type: String,
    required: [true, "last_name is required"],
  },
  position: {
    type: String,
    required: [true, "position is required"],
  },
  college: {
    type: String,
    required: [true, "college is required"],
  },
  student_number: {
    type: String,
    required: [true, "student_number is required"],
  },
  contact_number: {
    type: String,
    required: [true, "contact_number is required"],
  },
  address: {
    type: String,
    required: [true, "address is required"],
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
    required: [true, "religion is required"],
  },
  citizenship: {
    type: String,
    required: [true, "citizenship is required"],
  },
  gender: {
    type: String,
    required: [true, "gender is required"]
  },
  educational_background: {
    type: Schema.Types.ObjectId,
    ref: "EducationalBackground",
  },
  is_new_member: {
    type: Boolean,
    default: true,
  },
  program: {
    type: String,
    required: [true, "program is required"],
  },
  year_level: {
    type: String,
    required: ["year_level is required", true],
  },
});

const Member = models.Member || model("Member", MemberModel);

export default Member;
