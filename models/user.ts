import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  position: {
    type: String,
  },
  image: {
    type: String,
  },
  requestedBy: {
    type: String,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
});

UserSchema.index({ isArchived: 1 });
const User = models.User || model("User", UserSchema);

export default User;
