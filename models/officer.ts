// models/officer.ts
import { Schema, model, models } from "mongoose";

const educationalBackgroundSchema = new Schema({
  level: {
    type: String,
    // enum: ["Secondary", "College", "Special Training"],
  },
  nameAndLocation: {
    type: String,
  },
  yearOfGraduation: {
    type: String,
  },
  organization: {
    type: String,
  },
  position: {
    type: String,
  },
});

const recordOfExtraCurricularActivitiesSchema = new Schema({
  nameOfOrganization: {
    type: String,
  },
  position: {
    type: String,
  },
  inclusiveDates: {
    type: String,
  },
});

const officerSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  position: {
    type: String,
  },
  affiliation: {
    type: String,
  },
  program: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  residence: {
    type: String,
  },
  email: {
    type: String,
  },
  facebook: {
    type: String,
  },
  educationalBackground: [educationalBackgroundSchema],
  recordOfExtraCurricularActivities: [recordOfExtraCurricularActivitiesSchema],
  religion: {
    type: String,
  },
  citizenship: {
    type: String,
  },
  gender: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["COMPLETE", "INCOMPLETE"],
  },
  academicYear: { 
    type: String,
  },
  
});

const Officer = models.Officer || model("Officer", officerSchema);

export default Officer;
