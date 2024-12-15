import { Schema, model, models } from "mongoose";

const NotificationModel = new Schema({
  text: String,
  date: Date,
  link: String,
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  annex: {
    type: Schema.Types.ObjectId,
    ref: "Annex",
  },
});

const Notification = models.Notification || model("Notification", NotificationModel);

export default Notification;
