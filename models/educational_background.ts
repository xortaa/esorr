import { Schema, model, models } from "mongoose";

const EducationalBackgroundModel = new Schema({
  attainment: {
    type: String,
    required: [true, "attainment is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  location: {
    type: String,
    required: [true, "location is required"],
  },
  year_of_graduation: {
    type: String,
    required: [true, "year_of_graduation is required"],
  },
  organizations: [
    {
      name: { type: String },
      position: { type: String },
    },
  ],
});

const EducationalBackground =
  models.EducationalBackground || model("EducationalBackgruond", EducationalBackgroundModel);

export default EducationalBackground;
