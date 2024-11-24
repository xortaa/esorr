// C:\Users\kercwin\code\dev\esorr\models\user.ts
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["OSA", "AU", "SOCC", "RSO"],
    required: true,
  },
  image: {
    type: String,
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  isSetup: {
    type: Boolean,
    default: false,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
