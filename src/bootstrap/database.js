import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const connectDB = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};

export default connectDB;
