export type ItemResponse<T> = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  dataList: T[];
};
