import mongoose, { Document, Schema } from "mongoose";

// Define Book Schema
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
        required: true,
      },
      thumbnail: {
        type: String,
        required: true,
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

export interface IBook extends Document {
  title: string;
  googleID: string;
  authors: string[];
  publisher: string;
  description: string;
  publishedDate: Date;
  categories: string[];
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export default Book;
