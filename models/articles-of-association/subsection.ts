import { Schema, model, models } from "mongoose";

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
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section",
  },
  letteredParagraphs: [
    {
      type: Schema.Types.ObjectId,
      ref: "LetteredParagraph",
    },
  ],
});

const Subsection = models.Subsection || model("Subsection", SubsectionSchema);

export default Subsection;
