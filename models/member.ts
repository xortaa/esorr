import { Schema, model, models } from "mongoose";

const MemberModel = new Schema({
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  studentNumber: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  program: {
    type: String,
  },
  yearLevel: {
    type: Number,
  },
  startYear: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["COMPLETE", "INCOMPLETE"],
  },
  isOfficer: {
    type: Boolean,
    default: false,
  },
  isNewMember: {
    type: Boolean,
    default: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

const Member = models.Member || model("Member", MemberModel);

export default Member;
