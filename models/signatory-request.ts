// C:\Users\kercwin\code\dev\esorr\models\signatory-request.ts
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
  requestedBy: {
    type: String,
    required: true,
  },  
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const SignatoryRequest = models.SignatoryRequest || model("SignatoryRequest", SignatoryRequestSchema);

export default SignatoryRequest;
