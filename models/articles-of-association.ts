import { Schema, model, models } from "mongoose";

const LetteredParagraphSchema = new Schema({
  letter: String,
  paragraph: String,
});

const SubsectionSchema = new Schema({
  number: String,
  title: String,
  paragraph: String,
  letteredParagraphs: [LetteredParagraphSchema],
});

const SectionSchema = new Schema({
  number: String,
  title: String,
  paragraph: String,
  image: String,
  letteredParagraphs: [LetteredParagraphSchema],
  subsections: [SubsectionSchema],
});

const ArticleSchema = new Schema({
  order: String,
  title: String,
  sections: [SectionSchema],
});

const ArticlesOfAssociationSchema = new Schema({
  articles: [ArticleSchema],
  annexc1: {
    type: Schema.Types.ObjectId,
    ref: "AnnexC1",
    required: true,
    unique: true,
  },
});

// Ensure the index is created with the correct options
ArticlesOfAssociationSchema.index({ annexc1: 1 }, { unique: true });

const ArticlesOfAssociation =
  models.ArticlesOfAssociation || model("ArticlesOfAssociation", ArticlesOfAssociationSchema);

export default ArticlesOfAssociation;
