import mongoose, { Document, Schema } from "mongoose";

// Define User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

export default User;
