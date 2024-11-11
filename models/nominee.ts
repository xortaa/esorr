// C:\Users\kercw\code\dev\esorr\models\nominee.ts
import { Schema, model, models } from "mongoose";

const nomineeSchema = new Schema({
  name: {
    type: String,
  },
  faculty: {
    type: String,
  },
  email: {
    type: String,
  },
  landline: {
    type: String,
  },
  mobile: {
    type: String,
  },
  cv: {
    type: String,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
});

const Nominee = models.Nominee || model("Nominee", nomineeSchema);

export default Nominee;
