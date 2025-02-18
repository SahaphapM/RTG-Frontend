export type PaginationQuery = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
};

export type PaginationResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
