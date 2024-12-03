import mongoose, { Document, Schema } from "mongoose";

const discussionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    meetingLink: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Discussion = mongoose.model<IDiscussion>("Discussion", discussionSchema);

export interface IDiscussion extends Document {
  title: string;
  book: mongoose.Schema.Types.ObjectId;
  content: string;
  date: Date;
  participants: mongoose.Schema.Types.ObjectId[];
  meetingLink: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

export default Discussion;
