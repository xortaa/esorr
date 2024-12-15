import { Schema, model, models } from "mongoose";

const ProgramSchema = new Schema({
  name: {
    type: String,
  },
  isArchived: { 
    type: Boolean,
    default: false,
    index: true,
  }
});

const AffiliationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
  programs: [ProgramSchema],
});

const Affiliation = models.Affiliation || model("Affiliation", AffiliationSchema);

export default Affiliation;
