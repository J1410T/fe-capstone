/**
 * API utility functions
 * Centralized API handling with error management and loading states
 */

/**
 * Generic API caller with integrated error handling and loading state management
 */
export const api = {
  /**
   * Calls an API function with automatic loading and error state management
   * @param store Store with setLoading and setError methods
   * @param fetcher The API function to call
   * @returns Promise with the API result
   */
  call: async <
    T,
    S extends {
      setLoading: (loading: boolean) => void;
      setError: (error: Error | null) => void;
    }
  >(
    store: S,
    fetcher: () => Promise<T>
  ): Promise<T> => {
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
  },

  /**
   * Simple API call without store integration
   */
  callSimple: async <T>(
    fetcher: () => Promise<T>
  ): Promise<{ data?: T; error?: Error }> => {
    try {
      const data = await fetcher();
      return { data };
    } catch (error) {
      return { error: error as Error };
    }
  },
};

/**
 * HTTP status code utilities
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Common API error messages
 */
export const ApiErrors = {
  NETWORK_ERROR: "Network error occurred",
  UNAUTHORIZED: "You are not authorized to perform this action",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation error",
  SERVER_ERROR: "Internal server error",
} as const;

/**
 * Checks if an error is a network error
 */
export const isNetworkError = (error: Error): boolean => {
  return (
    error.message.toLowerCase().includes("network") ||
    error.message.toLowerCase().includes("fetch")
  );
};

/**
 * Extracts error message from various error formats
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return "An unknown error occurred";
};
