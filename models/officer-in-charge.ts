import {Schema, model, models} from "mongoose";

const officerInChargeSchema = new Schema({
  name: {
    type: String,
  },
});

const OfficerInCharge = models.OfficerInCharge || model("OfficerInCharge", officerInChargeSchema);

export default OfficerInCharge;