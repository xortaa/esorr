import mongoose from "mongoose";

let isConnected: boolean = false;

const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI is must be set in the environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "esorr",
    });
    isConnected = true;
    console.log("MongoDB is connected");

    require("@/models/activity")
    require("@/models/affiliation")
    require("@/models/annex-01")
    require("@/models/annex-02")
    require("@/models/annex-a")
    require("@/models/annex-a1")
    require("@/models/annex-b")
    require("@/models/annex-c")
    require("@/models/annex-c1")
    require("@/models/annex-d")
    require("@/models/annex-e")
    require("@/models/annex-e1")
    require("@/models/annex-e2")
    require("@/models/annex-e3")
    require("@/models/annex-f")
    require("@/models/annex-g")
    require("@/models/annex-h")
    require("@/models/annex-i")
    require("@/models/annex-j")
    require("@/models/annex-k")
    require("@/models/annex-l")
    require("@/models/articles-of-association")
    require("@/models/educational-background-organization")
    require("@/models/educational-background")
    require("@/models/event");
    require("@/models/financial-report");
    require("@/models/inflow");
    require("@/models/member");
    require("@/models/nominee");
    require("@/models/officer");
    require("@/models/operational-assessment");
    require("@/models/organization");
    require("@/models/outflow");
    require("@/models/pasoc");
    require("@/models/signatory-request");
    require("@/models/user");

  } catch (error) {
    console.log(error);
  }
};

export default connectToDatabase;
