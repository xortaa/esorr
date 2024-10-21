import { Schema, model, models } from "mongoose";

const Annex02Schema = new Schema({
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

const Annex02 = models.Annex02 || model("Annex02", Annex02Schema);

export default Annex02;
