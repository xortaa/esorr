import { Schema, model, models } from "mongoose";

const ArticleSchema = new Schema({
  order: {
    type: Number,
  },
  title: {
    type: String,
  },
  description: [
    {
      type: String,
    },
  ],
  sections: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  annex_c_1: {
    type: Schema.Types.ObjectId,
    ref: "AnnexC1",
  },
});

const Article = models.Article || model("Article", ArticleSchema);

export default Article;
