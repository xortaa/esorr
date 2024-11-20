import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema({ 
  name: String,
  position: String,
  signatureUrl: String,
})

const Annex02Schema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
    required: true,
  },
  levelOfRecognition: String,
  facebook: String,
  isWithCentralOrganization: Boolean,
  isReligiousOrganization: Boolean,
  affiliation: String,
  submissionDate: Date,
  osaPetitionStatus: {
    type: String,
    enum: ["GRANTED", "GRANTED WITH OFFICE", "DENIED", "OTHER"],
    default: null,
  },
  osaPetitionYears: {
    type: Number,
    default: null,
  },
  osaOtherRemarks: {
    type: String,
    default: null,
  },
  osaDecisionDate: {
    type: Date,
    default: null,
  },
  president: SignatureSchema,
  adviser: SignatureSchema,
  coAdviser: SignatureSchema,
  swdcCoordinator: SignatureSchema,
  dean: SignatureSchema,
  regent: SignatureSchema,
  centralOrganizationPresident: SignatureSchema,
  centralOrganizationAdviser: SignatureSchema,
  director: SignatureSchema,
  officialEmail: String,
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

const Annex02 = models.Annex02 || model("Annex02", Annex02Schema);

export default Annex02;
