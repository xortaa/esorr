import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["OSA", "AU", "SOCC", "RSO-SIGNATORY", "SOCC-SIGNATORY"],
    required: true,
  },
  position: {
    type: String,
  },
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
});

const User = models.User || model("User", UserSchema);

export default User;
