import { Schema, model, models } from "mongoose";

const EduationalBackgroundOrganizationModel = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  position: {
    type: String,
    required: [true, "position is required"],
  },
});

const EducationalBackgroundOrganization =
  models.EducationalBackgroundOrganization ||
  model("EducationalBackgroundOrganization", EduationalBackgroundOrganizationModel);

export default EducationalBackgroundOrganization;
