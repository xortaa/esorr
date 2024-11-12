import mongoose from "mongoose";

const AnnexDSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  academicYear: {
    type: String,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
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
});

const AnnexD = mongoose.models.AnnexD || mongoose.model("AnnexD", AnnexDSchema);
export default AnnexD;
