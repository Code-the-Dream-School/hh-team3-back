import mongoose from "mongoose";

export interface IGetDiscussionsQuery {
  search?: string;
  timePeriod?: "future" | "past";
  sort?: "latest" | "oldest";
}

export interface IJoinDiscussionBody {
  user: mongoose.Schema.Types.ObjectId;
}