import { Schema, model, models } from "mongoose";

const SectionSchema = new Schema({
  order: {
    type: Number,
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
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article",
  },
  subsections: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subsection",
    },
  ],
  letteredParagraphs: [
    {
      type: Schema.Types.ObjectId,
      ref: "LetteredParagraph",
    },
  ],
});

const Section = models.Section || model("Section", SectionSchema);

export default Section;
