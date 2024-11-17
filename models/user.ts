// C:\Users\kercwin\code\dev\esorr\models\user.ts
import { Schema, model, models } from "mongoose";

const PositionSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["OSA", "AU", "SOCC", "RSO-SIGNATORY", "SOCC-SIGNATORY", "RSO"],
    required: true,
  },
  positions: [PositionSchema],
  image: {
    type: String,
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
  organizations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
  prefix: {
    type: String,
  },
  suffix: {
    type: String,
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
  affiliation: {
    type: String,
  },
  isSetup: {
    type: Boolean,
    default: false,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
