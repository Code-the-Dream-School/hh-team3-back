export interface IGetBooksQuery {
  search?: string;
  categories?: string;
  sort?: "a-z" | "z-a" | "latest" | "oldest";
}
