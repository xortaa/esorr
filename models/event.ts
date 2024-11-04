import { Schema, model, models } from "mongoose";

const EvaluationSummarySchema = new Schema(
  {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 },
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
    "Pre-event Publicity": { type: EvaluationSummarySchema },
    Objectives: { type: EvaluationSummarySchema },
    "Program Flow": { type: EvaluationSummarySchema },
    "Organizers/Facilitators": { type: EvaluationSummarySchema },
    "Venue/Online Platform": { type: EvaluationSummarySchema },
    "Time Allotment": { type: EvaluationSummarySchema },
    "Registration/Attendance": { type: EvaluationSummarySchema },
    Overall: { type: EvaluationSummarySchema },
  },
  assessment: {
    criteria: {
      "DISSEMINATION OF INFORMATION": { type: AssessmentCriteriaSchema },
      "PREPARATION TIME": { type: AssessmentCriteriaSchema },
      "THEME RELEVANCE": { type: AssessmentCriteriaSchema },
      VENUE: { type: AssessmentCriteriaSchema },
      "TIME SCHEDULE": { type: AssessmentCriteriaSchema },
      "PROGRAM FLOW": { type: AssessmentCriteriaSchema },
      HOSTS: { type: AssessmentCriteriaSchema },
      "SOCC ASSISTANCE": { type: AssessmentCriteriaSchema },
      "OVERALL QUALITY OF THE EVENT": { type: AssessmentCriteriaSchema },
    },
    comments: [{ id: { type: String }, text: { type: String } }],
    sponsorName: { type: String },
    sponsorshipTypes: [{ type: String }],
  },
});

const Event = models.Event || model("Event", EventSchema);

export default Event;
