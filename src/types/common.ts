/**
 * Trạng thái của loader
 */
export type LoaderStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Response cơ bản cho tất cả các loaders
 */
export interface BaseLoaderResponse<T> {
  /** Dữ liệu trả về */
  data: T;
  /** Trạng thái của request */
  status: LoaderStatus;
  /** Thông báo lỗi nếu có */
  error?: string;
}

/**
 * Tham số phân trang
 */
export interface PaginationParams {
  /** Trang hiện tại */
  page: number;
  /** Số lượng item trên mỗi trang */
  limit: number;
}

/**
 * Tham số sắp xếp
 */
export interface SortParams {
  /** Trường để sắp xếp */
  sortBy?: string;
  /** Thứ tự sắp xếp */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Tham số lọc
 */
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}
