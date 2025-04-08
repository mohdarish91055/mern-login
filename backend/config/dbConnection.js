import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected successfully");
  } catch (err) {
    console.log(err, "not connected");
  }
};

export default connectDb;
