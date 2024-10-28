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

const ArticleOfAssociationSchema = new Schema({
  articles: {
    type: [ArticleSchema],
  },
  annexc1: {
    type: Schema.Types.ObjectId,
    ref: "AnnexC1",
    unique: true,
  },
});

const ArticlesOfAssociation =
  models.ArticlesOfAssociation || model("ArticlesOfAssociation", ArticleOfAssociationSchema);

export default ArticlesOfAssociation;
