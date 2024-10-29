import { Schema, model, models } from "mongoose";

const AnnexC1Schema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  articlesOfAssociation: {
    type: Schema.Types.ObjectId,
    ref: "ArticlesOfAssociation",
    default: null,
  },
});

// Remove any existing index on articlesOfAssociation
AnnexC1Schema.index({ articlesOfAssociation: 1 }, { unique: false, sparse: true });

const AnnexC1 = models.AnnexC1 || model("AnnexC1", AnnexC1Schema);

export default AnnexC1;
