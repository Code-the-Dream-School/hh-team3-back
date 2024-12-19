import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  title: string;
  googleID: string;
  link: string;
  authors: string[];
  publisher: string;
  description: string;
  publishedDate: Date;
  categories: string[];
  imageLinks: {
    bookCoverId: string;
    smallThumbnail: string;
    thumbnail: string;
  };
}

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
      bookCoverId: {
        type: String,
        required: false,
        default: "",
      },
      smallThumbnail: {
        type: String,
        required: false,
        default: "",
      },
      thumbnail: {
        type: String,
        required: false,
        default: "",
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
