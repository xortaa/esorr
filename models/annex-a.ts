import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({ 
  name: String,
  signatureUrl: String,
})

const AnnexASchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYearOfLastRecognition: {
    type: String,
  },
  affiliation: {
    type: String,
  },
  officialEmail: {
    type: String,
  },
  officialWebsite: {
    type: String,
  },
  organizationSocials: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
  },
  strategicDirectionalAreas: {
    type: [String],
    default: [],
  },
  mission: {
    type: String,
  },
  vision: {
    type: String,
  },
  description: {
    type: String,
  },
  objectives: {
    type: [String],
    default: [],
  },
  startingBalance: {
    type: Number,
    default: 0,
  },
  academicYear: {
    type: String,
    required: true,
  },
  advisers: {
    type: [Schema.Types.ObjectId],
    ref: "Nominee",
  },
  officers: {
    type: [Schema.Types.ObjectId],
    ref: "Officer",
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: "Member",
  },
  outflows: {
    type: [Schema.Types.ObjectId],
    ref: "Outflow",
  },
  outgoingSecretary: SignatureSchema,
  incomingSecretary: SignatureSchema,
  outgoingTreasurer: SignatureSchema,
  incomingTreasurer: SignatureSchema,
  outgoingPresident: SignatureSchema,
  incomingPresident: SignatureSchema,
  status: {
    type: String,
    enum: ["Not Submitted", "Rejected", "For Review", "Approved"],
    default: "Not Submitted",
  },
  soccRemarks: {
    type: String,
    default: "",
  },
  osaRemarks: {
    type: String,
    default: "",
  },
  dateSubmitted: Date,
});

const AnnexA = models.AnnexA || model("AnnexA", AnnexASchema);

export default AnnexA;
