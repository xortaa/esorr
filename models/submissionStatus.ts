import { Schema, model, models } from "mongoose";

const SubmissionAllowedSchema = new Schema({
  submissionAllowed: {
    type: Boolean,
    default: true,
  },
});

const SubmissionAllowed = models.SubmissionAllowed || model("SubmissionAllowed", SubmissionAllowedSchema);

export default SubmissionAllowed;