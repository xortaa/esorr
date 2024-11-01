import { Schema, model, models } from "mongoose";

const AnnexE2Schema = new Schema({
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
  inflow: {
    type: [Schema.Types.ObjectId],
    ref: "Inflow",
  },
  outflow: {
    type: [Schema.Types.ObjectId],
    ref: "Outflow",
  },
});

const AnnexE2 = models.AnnexE2 || model("AnnexE2", AnnexE2Schema);

export default AnnexE2;
