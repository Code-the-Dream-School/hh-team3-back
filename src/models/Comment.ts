import mongoose, { Schema } from "mongoose";
import { IComment } from "../interfaces/commentInterfaces";

const commentSchema = new Schema<IComment>(
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
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
