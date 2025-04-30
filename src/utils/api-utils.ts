/**
 * Trình xử lý API đơn giản với xử lý lỗi tích hợp
 */
export const api = {
  /**
   * Gọi API với xử lý lỗi và loading state
   * @param store Store Zustand để cập nhật trạng thái
   * @param fetcher Hàm gọi API
   * @returns Kết quả từ API
   */
  call: async <T, S extends { setLoading: (loading: boolean) => void; setError: (error: Error | null) => void }>(store: S, fetcher: () => Promise<T>): Promise<T> => {
    store.setLoading(true);
    store.setError(null);
    
    try {
      return await fetcher();
    } catch (error) {
      store.setError(error as Error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }
};
