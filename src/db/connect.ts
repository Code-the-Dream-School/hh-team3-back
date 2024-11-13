import mongoose, { Connection } from "mongoose";

const connectDB = (url: string): Promise<Connection> => {
  return mongoose
    .connect(url, {})
    .then(() => mongoose.connection);
};

export default connectDB;