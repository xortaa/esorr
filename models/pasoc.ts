import { Schema, model, models } from "mongoose";

const RatingSchema = new Schema({
  rating: Number,
  comment: String,
});

const PasocSchema = new Schema({
  annexe3: {
    type: Schema.Types.ObjectId,
    ref: "AnnexE3",
  },
  servantLeadership: {
    "1": RatingSchema,
    "2": RatingSchema,
    "3": RatingSchema,
  },
  operationalPlan: {
    "1": RatingSchema,
    "2": RatingSchema,
  },
  constituentFocus: {
    "1": RatingSchema,
    "2": RatingSchema,
  },
  monitoringAndEvaluation: {
    "1": RatingSchema,
    "2": RatingSchema,
    "3": RatingSchema,
  },
  membershipAndOrganizationClimate: {
    "1": RatingSchema,
    "2": RatingSchema,
    "3": RatingSchema,
  },
  personalAndSocialAndCommunityService: {
    "1": RatingSchema,
    "2": RatingSchema,
  },
  outcomesAndAchievements: {
    "1": RatingSchema,
    "2": RatingSchema,
    "3": RatingSchema,
    "4": RatingSchema,
    "5": RatingSchema,
    "6": RatingSchema,
  },
  furtherComments: String,
});

const Pasoc = models.Pasoc || model("Pasoc", PasocSchema);

export default Pasoc;
