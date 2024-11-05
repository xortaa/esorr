import { Schema, model, models } from "mongoose";

const EvaluationRatingSchema = new Schema(
  {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 },
  },
  { _id: false }
);

const AssessmentCriteriaSchema = new Schema(
  {
    rating: { type: Number, default: 0 },
    analysis: { type: String, default: "" },
    recommendation: { type: String, default: "" },
  },
  { _id: false }
);

const EventSchema = new Schema({
  title: { type: String },
  eReserveNumber: { type: String },
  date: { type: Date },
  venue: { type: String },
  adviser: { type: String },
  timeAttended: {
    from: { type: String },
    to: { type: String },
  },
  speakerName: { type: String },
  speakerTopic: { type: String },
  speakerAffiliation: { type: String },
  speakerPosition: { type: String },
  totalParticipants: { type: Number },
  totalRespondents: { type: Number },
  evaluationSummary: {
    type: Map,
    of: EvaluationRatingSchema,
  },
  assessment: {
    criteria: {
      type: Map,
      of: AssessmentCriteriaSchema,
    },
  },
  comments: [{ id: { type: String }, text: { type: String } }],
  sponsorName: { type: String },
  sponsorshipTypes: [{ type: String }],
});

const Event = models.Event || model("Event", EventSchema);

export default Event;
