import { Schema, model, models } from "mongoose";

const ActivitySchema = new Schema({
  term: {
    type: String,
  },
  keyUnitActivity: {
    type: String,
  },
  targetDateRange: {
    type: String,
  },
  actualDateAccomplished: {
    type: Date,
  },
  postEventEvaluation: {
    type: String,
  },
  interpretation: {
    type: String,
  },
});

const Activity = models.Activity || model("Activity", ActivitySchema);

export default Activity;
