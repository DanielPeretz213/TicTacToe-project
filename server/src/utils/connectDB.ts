import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION!);
    console.log("Connected to DB successfully");
  } catch (error) {
    console.error("DB Connection Error details:", error); 
  }
}