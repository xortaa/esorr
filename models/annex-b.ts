import mongoose, { Schema, model, models, Document, Model } from "mongoose";

const SignatureSchema = new Schema({
  name: { type: String },
  position: { type: String },
  signatureUrl: { type: String },
});

interface YearDistribution {
  new: number;
  old: number;
}

interface ProgramDistribution {
  firstYear: YearDistribution;
  secondYear: YearDistribution;
  thirdYear: YearDistribution;
  fourthYear: YearDistribution;
  fifthYear: YearDistribution;
}

interface MemberDistribution {
  [program: string]: ProgramDistribution;
}

interface IAnnexB extends Document {
  organization: mongoose.Types.ObjectId;
  academicYear: string;
  isSubmitted: boolean;
  members: mongoose.Types.ObjectId[];
  numberOfOfficers: number;
  maleMembersBelow18: number;
  maleMembers18To20: number;
  maleMembers21AndAbove: number;
  femaleMembersBelow18: number;
  femaleMembers18To20: number;
  femaleMembers21AndAbove: number;
  memberDistribution: MemberDistribution;
  totalMembers: number;
  totalOfficersAndMembers: number;
  secretary: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  adviser: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  soccRemarks: string;
  osaRemarks: string;
  updateMemberCounts: () => Promise<void>;
  status: "Not Submitted" | "Rejected" | "For Review" | "Approved";
  dateSubmitted?: Date;
}

interface AnnexBModel extends Model<IAnnexB> {}

const AnnexBSchema = new Schema<IAnnexB>({
  organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  academicYear: { type: String, required: true },
  members: { type: [Schema.Types.ObjectId], ref: "Member", default: [] },
  numberOfOfficers: { type: Number, default: 0 },
  maleMembersBelow18: { type: Number, default: 0 },
  maleMembers18To20: { type: Number, default: 0 },
  maleMembers21AndAbove: { type: Number, default: 0 },
  femaleMembersBelow18: { type: Number, default: 0 },
  femaleMembers18To20: { type: Number, default: 0 },
  femaleMembers21AndAbove: { type: Number, default: 0 },
  memberDistribution: {
    type: Map,
    of: new Schema({
      firstYear: { new: { type: Number, default: 0 }, old: { type: Number, default: 0 } },
      secondYear: { new: { type: Number, default: 0 }, old: { type: Number, default: 0 } },
      thirdYear: { new: { type: Number, default: 0 }, old: { type: Number, default: 0 } },
      fourthYear: { new: { type: Number, default: 0 }, old: { type: Number, default: 0 } },
      fifthYear: { new: { type: Number, default: 0 }, old: { type: Number, default: 0 } },
    }),
    default: {},
  },
  totalMembers: { type: Number, default: 0 },
  totalOfficersAndMembers: { type: Number, default: 0 },
  secretary: SignatureSchema,
  adviser: SignatureSchema,
  status: {
    type: String,
    enum: ["Not Submitted", "Rejected", "For Review", "Approved"],
    default: "Not Submitted",
  },
  soccRemarks: {
    type: String,
    default: "",
  },
  osaRemarks: {
    type: String,
    default: "",
  },
  dateSubmitted: Date,
});

AnnexBSchema.methods.updateMemberCounts = async function (this: IAnnexB): Promise<void> {
  try {
    const Member = mongoose.model("Member");
    const members = await Member.find({ _id: { $in: this.members } }).lean();

    console.log("Members found:", members.length);

    const counts = {
      numberOfOfficers: 0,
      maleMembersBelow18: 0,
      maleMembers18To20: 0,
      maleMembers21AndAbove: 0,
      femaleMembersBelow18: 0,
      femaleMembers18To20: 0,
      femaleMembers21AndAbove: 0,
    };

    const memberDistribution: MemberDistribution = {};

    for (const member of members) {
      console.log("Processing member:", member);

      if (member.isOfficer) counts.numberOfOfficers++;
      if (member.gender === "Male") {
        if (member.age < 18) counts.maleMembersBelow18++;
        else if (member.age <= 20) counts.maleMembers18To20++;
        else counts.maleMembers21AndAbove++;
      } else if (member.gender === "Female") {
        if (member.age < 18) counts.femaleMembersBelow18++;
        else if (member.age <= 20) counts.femaleMembers18To20++;
        else counts.femaleMembers21AndAbove++;
      }

      if (!member.program) {
        console.warn(`Member ${member._id} has no program specified`);
        continue;
      }

      if (!memberDistribution[member.program]) {
        memberDistribution[member.program] = {
          firstYear: { new: 0, old: 0 },
          secondYear: { new: 0, old: 0 },
          thirdYear: { new: 0, old: 0 },
          fourthYear: { new: 0, old: 0 },
          fifthYear: { new: 0, old: 0 },
        };
      }

      const yearLevel = member.yearLevel;
      if (yearLevel < 1 || yearLevel > 5) {
        console.warn(`Invalid yearLevel: ${yearLevel} for member: ${member._id}`);
        continue;
      }

      const yearKey = `${
        ["first", "second", "third", "fourth", "fifth"][yearLevel - 1]
      }Year` as keyof ProgramDistribution;
      const statusKey = member.isNewMember ? "new" : "old";

      memberDistribution[member.program][yearKey][statusKey]++;
    }

    console.log("Final memberDistribution:", JSON.stringify(memberDistribution, null, 2));

    Object.assign(this, counts);
    this.memberDistribution = memberDistribution;
    this.totalMembers = members.length;
    this.totalOfficersAndMembers = this.totalMembers;

    await this.save();
    console.log("AnnexB updated successfully");
  } catch (error) {
    console.error("Error in updateMemberCounts:", error);
    throw error;
  }
};

const AnnexB = (models.AnnexB || model<IAnnexB, AnnexBModel>("AnnexB", AnnexBSchema)) as AnnexBModel;

export default AnnexB;
