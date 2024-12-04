export interface IGetBooksQuery {
  search?: string;
  categories?: string;
  sort?: "a-z" | "z-a" | "latest" | "oldest";
}

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
    smallThumbnail: string;
    thumbnail: string;
  };
}
