import { Schema, model, models } from "mongoose";

const AffiliationModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
});

AffiliationModel.index({ isArchived: 1 });

const Affiliation = models.Affiliation || model("Affiliation", AffiliationModel);

export default Affiliation;
