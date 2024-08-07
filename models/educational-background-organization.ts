import { Schema, model, models } from "mongoose";

const EduationalBackgroundOrganizationModel = new Schema(
  {
    name: {
      type: String,
    },
    position: {
      type: String,
    },
    educational_background: {
      type: Schema.Types.ObjectId,
      ref: "EducationalBackground",
    },
  },
  { collection: "educational_backgrounds_organization" }
);

const EducationalBackgroundOrganization =
  models.EducationalBackgroundOrganization ||
  model("EducationalBackgroundOrganization", EduationalBackgroundOrganizationModel);

export default EducationalBackgroundOrganization;
