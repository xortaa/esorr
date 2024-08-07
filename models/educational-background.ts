import { Schema, model, models } from "mongoose";

const EducationalBackgroundModel = new Schema(
  {
    attainment: {
      type: String,
      enum: ["Secondary", "College", "Special Training"],
    },
    name: {
      type: String,
    },
    location: {
      type: String,
    },
    year_of_graduation: {
      type: String,
    },
    organizations: [
      {
        type: Schema.Types.ObjectId,
        ref: "EducationalBackgroundOrganization",
      },
    ],
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  { collection: "educational_backgrounds" }
);

const EducationalBackground =
  models.EducationalBackground || model("EducationalBackground", EducationalBackgroundModel);

export default EducationalBackground;
