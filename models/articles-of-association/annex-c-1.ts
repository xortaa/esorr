import { Schema, model, models } from "mongoose";

const AnnexC1Schema = new Schema(
  {
    articles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Articles",
      },
    ],
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { collection: "annex_c_1" }
);

const AnnexC1s = models.AnnexC1 || model("AnnexC1", AnnexC1Schema);

export default AnnexC1s;
