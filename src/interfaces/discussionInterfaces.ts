import mongoose from "mongoose";

export interface IGetDiscussionsQuery {
  search?: string;
  sort?: "latest" | "oldest";
}

export interface IJoinDiscussionBody {
  user: mongoose.Schema.Types.ObjectId;
}

export interface IDiscussion extends Document {
  title: string;
  book: mongoose.Schema.Types.ObjectId;
  content: string;
  date: Date;
  participants: mongoose.Schema.Types.ObjectId[];
  meetingLink: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}