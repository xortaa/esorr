import { Schema, model, models } from "mongoose";

const AnnexESchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  operationalAssessment: { 
    type: Schema.Types.ObjectId,
    ref: 'OperationalAssessment',
  }
});

const AnnexE = models.AnnexE || model("AnnexE", AnnexESchema);

export default AnnexE;
