import mongoose from "mongoose";

const AnnexDSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
  },
  description: {
    type: String,
  },
  secretary: {
    name: String,
    position: String,
    signatureUrl: String,
    signatureDate: Date,
  },
  letterhead: {
    type: String,
  },
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

const AnnexD = mongoose.models.AnnexD || mongoose.model("AnnexD", AnnexDSchema);
export default AnnexD;
