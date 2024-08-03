import { Schema, model, models } from "mongoose";

const EduationalBackgroundOrganizationModel = new Schema({
  name: {
    type: String,
  },
  position: {
    type: String,
  },
});

const EducationalBackgroundOrganization =
  models.EducationalBackgroundOrganization ||
  model("EducationalBackgroundOrganization", EduationalBackgroundOrganizationModel);

export default EducationalBackgroundOrganization;
