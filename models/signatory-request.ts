import { Schema, model, models } from "mongoose";

const SignatoryRequestSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    index: true,
  },
  position: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true,
  },
  requestedBy: {
    type: String,
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
});

const SignatoryRequest = models.SignatoryRequest || model("SignatoryRequest", SignatoryRequestSchema);

export default SignatoryRequest;
