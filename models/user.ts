import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
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
  first_name: {
    type: String,
    required: [true, "First name is required for ADVISER role only"],
    validate: {
      validator: function (v: string) {
        return this.role === "ADVISER" ? v !== "" : true;
      },
      message: "First name is required for ADVISER role only",
    },
  },
  middle_name: {
    type: String,
    required: [true, "Middle name is required for ADVISER role only"],
    validate: {
      validator: function (v: string) {
        return this.role === "ADVISER" ? v !== "" : true;
      },
      message: "Middle name is required for ADVISER role only",
    },
  },
  last_name: {
    type: String,
    required: [true, "Last name is required for ADVISER role only"],
    validate: {
      validator: function (v: string) {
        return this.role === "ADVISER" ? v !== "" : true;
      },
      message: "Last name is required for ADVISER role only",
    },
  },
  contact_number: {
    type: String,
    required: [true, "Contact number is required for ADVISER role only"],
    validate: {
      validator: function (v: string) {
        return this.role === "ADVISER" ? v !== "" : true;
      },
      message: "Contact number is required for ADVISER role only",
    },
  },
  college: {
    type: String,
    required: [true, "College is required for ADVISER role only"],
    validate: {
      validator: function (v: string) {
        return this.role === "ADVISER" ? v !== "" : true;
      },
      message: "College is required for ADVISER role only",
    },
  },
  address: {
    type: String,
    required: [true, "Address is required for ADVISER role only"],
    validate: {
      validator: function (v: string) {
        return this.role === "ADVISER" ? v !== "" : true;
      },
      message: "Address is required for ADVISER role only",
    },
  },
  second_address: {
    type: String,
    validate: {
      function(v: string) {
        return this.role !== "ADVISER" || typeof v === "string"; //allow empty string for all roles
      },
      message: "Second address is for ADVISER role only",
    },
  },
  signature: {
    type: String,
    validate: {
      function(v: string) {
        return this.role !== "ADVISER" || typeof v === "string"; //allow empty string for all roles
      },
      message: "signature is for ADVISER role only",
    },
  },
});

const User = models.User || model("User", UserSchema);

export default User;
