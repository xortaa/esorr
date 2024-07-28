import { Schema, model, models } from "mongoose";

const SocialSchema = new Schema({
  platform: {
    type: String,
    required: [true, "platform is required"],
  },
  link: {
    type: String,
    required: [true, "link is required"],
  },
});

const Social = models.Socials || model("Socials", SocialSchema);

export default Social;
