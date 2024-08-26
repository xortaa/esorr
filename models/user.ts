import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["RSO", "OSA", "SOCC", "AU", "ADVISER"],
    required: true,
    default: "AU",
  },
  affiliation: {
    type: String,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  first_name: {
    type: String,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  college: {
    type: String,
  },
  address: {
    type: String,
  },
  second_address: {
    type: String,
  },
  signature: {
    type: String,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
