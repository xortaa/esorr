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

    require("@/models/user");
    require("@/models/social");
    require("@/models/organization");
    require("@/models/member");
    require("@/models/educational-background");
    require("@/models/educational-background-organization");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDatabase;
