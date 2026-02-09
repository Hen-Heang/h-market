export type Category = {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
};

export type Pagination = {
  last: boolean;
  first: boolean;
  size: number;
  totalPages: number;
  currentPage: number;
  currentTotalElements: number;
  totalElements: number;
  empty: boolean;
};

export type CategoryPageResponse = {
  categories: Category[];
  pagination: Pagination;
};

export type CategoryPageResponseApi = CategoryPageResponse;
