// C:\Users\kercw\code\dev\esorr\models\annex-01.ts
import { Schema, model, models } from "mongoose";

const Annex01Schema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
    required: true,
  },
  president: {
    name: String,
    position: String,
    signatureUrl: String,
    dateSigned: Date,
  },
  soccRemarks: {
    type: String,
    default: "",
  },
  osaRemarks: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "For Review", "Approved"],
    default: "Not Started",
  },
  dateSubmitted: Date, 
  lastModified: Date,
});

const Annex01 = models.Annex01 || model("Annex01", Annex01Schema);

export default Annex01;
