export type PaginationMeta = {
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const defaultPaginationMeta: PaginationMeta = {
  total: 0,
  pageSize: 10,
  pageNumber: 1,
  hasNextPage: true,
  hasPrevPage: true,
  totalPages: 0,
};

export type PaginationResponse<T> = {
  total: number;
  data: T[];
};
