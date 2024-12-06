import { Document, ObjectId } from "mongoose";

export interface IComment extends Document {
  user: ObjectId;
  book: ObjectId;
  text: string;
  likeCount: number;
}