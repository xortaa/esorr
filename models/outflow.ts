import { Schema, model, models } from "mongoose";

const OutflowItemSchema = new Schema({
  category: String,
  description: String,
  cost: Number,
  quantity: Number,
  serialNumber: String,
});

const OutflowSchema = new Schema({
  establishment: String,
  date: Date,
  items: [OutflowItemSchema],
  totalCost: Number,
  image: String,
});

const Outflow = models.Outflow || model("Outflow", OutflowSchema);

export default Outflow;
