import { Document, Schema } from "mongoose";

export interface IComment extends Document {
    user: Schema.Types.ObjectId;
    book: Schema.Types.ObjectId;
    text: string;
    likes: Schema.Types.ObjectId[];
    likeCount: number;
}