import { Schema, model, models } from "mongoose";

const LetteredParagraphSchema = new Schema(
  {
    letter: {
      type: String,
    },
    paragraph: {
      type: String,
    },
    subsection: {
      type: Schema.Types.ObjectId,
      ref: "Subsection",
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  },
  { collection: "lettered_paragraph" }
);

const LetteredParagraph = models.LetteredParagraph || model("LetteredParagraph", LetteredParagraphSchema);

export default LetteredParagraph;
