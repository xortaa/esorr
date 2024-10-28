import { Schema, model, models } from "mongoose";

const LetteredParagraphSchema = new Schema({
  letter: {
    type: String,
  },
  paragraph: {
    type: String,
  },
});

const SubsectionSchema = new Schema({
  number: {
    type: String,
  },
  title: {
    type: String,
  },
  paragraph: {
    type: String,
  },
  letteredParagraphs: [LetteredParagraphSchema],
});

const SectionSchema = new Schema({
  number: {
    type: String,
  },
  title: {
    type: String,
  },
  paragraph: {
    type: String,
  },
  image: {
    type: String,
  },
  letteredParagraphs: [LetteredParagraphSchema],
  subsections: [SubsectionSchema],
});

const ArticleSchema = new Schema({
  order: {
    type: String,
  },
  title: {
    type: String,
  },
  sections: [SectionSchema],
});

const ArticlesOfAssociationSchema = new Schema({
  articles: {
    type: [ArticleSchema],
  },
  annexc1: {
    type: Schema.Types.ObjectId,
    ref: "AnnexC1",
    unique: true,
    sparse: true,
  },
});

// Ensure the index is created with the correct options
ArticlesOfAssociationSchema.index({ annexc1: 1 }, { unique: true, sparse: true });

const ArticlesOfAssociation =
  models.ArticlesOfAssociation || model("ArticlesOfAssociation", ArticlesOfAssociationSchema);

export default ArticlesOfAssociation;
