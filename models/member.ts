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
  startYear: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["COMPLETE", "INCOMPLETE"],
  },
});

const Member = models.Member || model("Member", MemberModel);

export default Member;
