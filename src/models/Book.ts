import mongoose, { Document, Schema } from "mongoose";
import { IBook } from "../interfaces/bookInterfaces";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    googleID: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    authors: {
      type: [String],
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    publishedDate: {
      type: Date,
      required: true,
      get: (val: Date) => val.toISOString().split("T")[0], // Format to YYYY-MM-DD
    },
    categories: {
      type: [String],
      required: true,
    },
    imageLinks: {
      smallThumbnail: {
        type: String,
        required: false,
      },
      thumbnail: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Book = mongoose.model<IBook>("Book", bookSchema);
export default Book;
