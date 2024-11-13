const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define the AnnexB schema
const AnnexBSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  numberOfOfficers: { type: Number, default: 0 },
  maleMembersBelow18: { type: Number, default: 0 },
  maleMembers18To20: { type: Number, default: 0 },
  maleMembers21AndAbove: { type: Number, default: 0 },
  femaleMembersBelow18: { type: Number, default: 0 },
  femaleMembers18To20: { type: Number, default: 0 },
  femaleMembers21AndAbove: { type: Number, default: 0 },
  memberDistribution: { type: Map, of: Schema.Types.Mixed, default: {} },
  totalMembers: { type: Number, default: 0 },
  totalOfficersAndMembers: { type: Number, default: 0 },
});

// Create the AnnexB model
const AnnexB = model("AnnexB", AnnexBSchema);

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/test_db", { useNewUrlParser: true, useUnifiedTopology: true });

// Function to test AnnexB creation
async function testAnnexBCreation() {
  try {
    // Create a mock organization ID
    const orgId = new mongoose.Types.ObjectId();

    // Attempt to create a new AnnexB document
    const newAnnexB = await AnnexB.create({
      organization: orgId,
      academicYear: "2023-2024",
      members: [],
      numberOfOfficers: 0,
      maleMembersBelow18: 0,
      maleMembers18To20: 0,
      maleMembers21AndAbove: 0,
      femaleMembersBelow18: 0,
      femaleMembers18To20: 0,
      femaleMembers21AndAbove: 0,
      memberDistribution: {},
      totalMembers: 0,
      totalOfficersAndMembers: 0,
    });

    console.log("Successfully created AnnexB:", newAnnexB);
  } catch (error) {
    console.error("Error creating AnnexB:", error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the test
testAnnexBCreation();
