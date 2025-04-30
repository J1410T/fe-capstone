/**
 * Utility cho Suspense trong React 19
 */

/**
 * Resource cho Suspense
 */
export interface Resource<TData> {
  read: () => TData;
}

/**
 * Tạo resource cho Suspense
 * @param promise Promise cần wrap
 * @returns Resource cho Suspense
 */
export function createResource<TData>(promise: Promise<TData>): Resource<TData> {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: TData;
  let error: Error;
  
  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (e) => {
      status = 'error';
      error = e instanceof Error ? e : new Error(String(e));
    }
  );
  
  return {
    read(): TData {
      switch (status) {
        case 'pending':
          throw suspender;
        case 'error':
          throw error;
        case 'success':
          return result;
      }
    }
  };
}
