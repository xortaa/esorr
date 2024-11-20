import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
  },
  signatories: [
    {
      type: Schema.Types.ObjectId,
      ref: "RsoSignatory",
    },
  ],
  isArchived: {
    type: Boolean,
    default: false,
    index: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  officialEmail: String,
  facebook: String, 
  isWithCentralOrganization: Boolean,
  isReligiousOrganization: Boolean,
  academicYearOfLastRecognition: String,
  levelOfRecognition: String,
  academicYear: String,
  isInactive: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Incomplete", "For Review", "Complete"],
    default: "Incomplete",
  },
  annex01: [
    {
      type: Schema.Types.ObjectId,
      ref: "Annex01",
      default: [],
    },
  ],
  annex02: [
    {
      type: Schema.Types.ObjectId,
      ref: "Annex02",
      default: [],
    },
  ],
  annexA: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexA",
      default: [],
    },
  ],
  annexA1: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexA1",
      default: [],
    },
  ],
  annexB: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexB",
      default: [],
    },
  ],
  annexC: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexC",
      default: [],
    },
  ],
  annexC1: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexC1",
      default: [],
    },
  ],
  annexD: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexD",
      default: [],
    },
  ],
  annexE: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexE",
      default: [],
    },
  ],
  annexE1: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexE1",
      default: [],
    },
  ],
  annexE2: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexE2",
      default: [],
    },
  ],
  annexE3: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexE3",
      default: [],
    },
  ],
  annexF: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexF",
      default: [],
    },
  ],
  annexG: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexG",
      default: [],
    },
  ],
  annexH: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexH",
      default: [],
    },
  ],
  annexI: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexI",
      default: [],
    },
  ],
  annexJ: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexJ",
      default: [],
    },
  ],
  annexK: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexK",
      default: [],
    },
  ],
  annexL: [
    {
      type: Schema.Types.ObjectId,
      ref: "AnnexL",
      default: [],
    },
  ],
});

const Organization = models.Organization || model("Organization", OrganizationSchema);

export default Organization;