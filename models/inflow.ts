import { Schema, model, models } from "mongoose";

const InflowSchema = new Schema({
  category: String,
  date: Date,
  amount: Number,
  payingParticipants: Number,
  totalMembers: Number,
  merchandiseSales: Number,
});

const Inflow = models.Inflow || model("Inflow", InflowSchema);

export default Inflow;
