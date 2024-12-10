import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IComment extends Document {
  user: ObjectId;
  book: ObjectId;
  text: string;
  likeCount: number;
}

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
