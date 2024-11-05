////C:\Users\kercw\code\dev\esorr\models\operational-assessment.ts

import { Schema, model, models } from "mongoose";

const OperationalAssessmentSchema = new Schema({
  annexE: {
    type: Schema.Types.ObjectId,
    ref: "AnnexE",
  },
  v01: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v02: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v03: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v04: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v05: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v06: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v07: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v08: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  v09: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  s1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  s2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  s3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  e1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  e2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  e3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  a1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  a2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  a3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  l1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  l2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  l3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg1: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg2: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg3: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg4: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg5: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg6: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg7: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg8: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg9: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg10: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg11: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg12: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg13: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg14: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg15: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg16: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  sdg17: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
});

const OperationalAssessment =
  models.OperationalAssessment || model("OperationalAssessment", OperationalAssessmentSchema);

export default OperationalAssessment;

