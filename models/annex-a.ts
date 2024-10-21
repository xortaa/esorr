import { Schema, model, models } from "mongoose";

const AnnexASchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYearOfLastRecognition: {
    type: String,
  },
  affiliation: {
    type: String,
  },
  officialEmail: {
    type: String,
  },
  officialWebsite: {
    type: String,
  },
  organizationSocials: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
  },
  strategicDirectionalAreas: {
    type: [String],
    default: [],
  },
  mission: {
    type: String,
  },
  vision: {
    type: String,
  },
  description: {
    type: String,
  },
  objectives: {
    type: [String],
    default: [],
  },
  startingBalance: {
    type: Number,
    default: 0,
  },
  academicYear: {
    type: String,
    required: true,
  },
  isSubmitted: { 
    type: Boolean, 
    default: false
  },
});

const AnnexA = models.AnnexA || model("AnnexA", AnnexASchema);

export default AnnexA;
