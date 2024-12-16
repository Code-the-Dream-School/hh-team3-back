import mongoose, { Schema } from "mongoose";

export interface IComment extends Document {
  user: Schema.Types.ObjectId;
  book: Schema.Types.ObjectId;
  discussion: Schema.Types.ObjectId;
  text: string;
  likes: Schema.Types.ObjectId[];
  likeCount: number;
}

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
      required: false,
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
      required: false,
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
