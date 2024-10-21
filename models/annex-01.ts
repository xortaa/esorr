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
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

const Annex01 = models.Annex01 || model("Annex01", Annex01Schema);

export default Annex01;
