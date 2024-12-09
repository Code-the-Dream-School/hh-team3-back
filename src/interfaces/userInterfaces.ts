import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UpdateContent {
  name?: string;
  email?: string;
}
