import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    throw new Error("MONGO_URI is required. Add it to backend/.env.");
  }

  mongoose.set("strictQuery", true);
  try {
    const connection = await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || "bidflow",
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;
