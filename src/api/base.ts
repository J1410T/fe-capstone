/**
 * API utility cơ bản với hỗ trợ Suspense
 */

import { createResource, type Resource } from "@/utils/suspense";
import { env } from "@/config/env";
// import { getToken } from './resources/auth';

// Biến để theo dõi nếu đang làm mới token
let isRefreshingToken = false;
// Hàng đợi các request đang chờ token mới
let refreshQueue: Array<() => void> = [];

/**
 * Interface cho tham số query
 */
export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

/**
 * Chuyển đổi đối tượng query params thành chuỗi URL
 */
export function buildQueryString(params: QueryParams): string {
  if (!params || Object.keys(params).length === 0) {
    console.log("buildQueryString: No params provided or empty object");
    return "";
  }

  console.log("buildQueryString: Building query string from params:", params);
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      console.log(`buildQueryString: Adding param ${key}=${String(value)}`);
      searchParams.append(key, String(value));
    } else {
      console.log(
        `buildQueryString: Skipping param ${key} because value is undefined or null`
      );
    }
  });

  const queryString = searchParams.toString();
  console.log(
    "buildQueryString: Final query string:",
    queryString ? `?${queryString}` : "(empty)"
  );
  return queryString ? `?${queryString}` : "";
}

/**
 * Xử lý làm mới token
 * @returns Promise<boolean> - true nếu làm mới thành công
 */
async function handleTokenRefresh(): Promise<boolean> {
  console.log("API base: handleTokenRefresh called");

  // Nếu đang làm mới token, đợi quá trình hoàn tất
  if (isRefreshingToken) {
    console.log("Token refresh already in progress, waiting...");
    return new Promise<boolean>((resolve) => {
      refreshQueue.push(() => resolve(true));
    });
  }

  try {
    isRefreshingToken = true;
    console.log("Starting token refresh");

    // Kiểm tra sessionStorage
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      console.log("No active session, skip token refresh");
      return false;
    }

    // Import động để tránh circular dependency
    const { authApi } = await import("./resources/auth");
    const response = await authApi.refreshToken();

    // Xử lý thành công
    if (response.success) {
      console.log("Token refresh successful");
      // Xử lý các request đang đợi
      refreshQueue.forEach((callback) => callback());
      refreshQueue = [];
      return true;
    }

    console.log("Token refresh failed");
    return false;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  } finally {
    isRefreshingToken = false;
  }
}

/**
 * API client cơ bản
 */
export const api = {
  /**
   * Gọi API và trả về dữ liệu
   * @param endpoint Endpoint API
   * @param params Tham số query (optional)
   * @param options Tùy chọn fetch (optional)
   * @returns Promise với dữ liệu
   */
  async fetch<TData>(
    endpoint: string,
    params?: QueryParams,
    options: RequestInit = {}
  ): Promise<TData> {
    const queryString = params ? buildQueryString(params) : "";

    // Xác định đường dẫn API dựa trên endpoint
    let fullUrl;

    if (endpoint.startsWith("http")) {
      // Nếu endpoint đã là URL đầy đủ, sử dụng trực tiếp
      fullUrl = `${endpoint}${queryString}`;
    } else {
      // Xác định đường dẫn API dựa trên endpoint
      const apiPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

      // Sử dụng API_SERVER từ biến môi trường
      const apiBaseUrl = env.API_BASE_URL.endsWith("/")
        ? env.API_BASE_URL.slice(0, -1)
        : env.API_BASE_URL;
      const serverUrl = env.API_SERVER.endsWith("/")
        ? env.API_SERVER.slice(0, -1)
        : env.API_SERVER;

      // Nếu đang trong môi trường development, sử dụng proxy
      if (env.NODE_ENV === "development") {
        // Sử dụng đường dẫn tương đối để proxy sẽ xử lý
        if (endpoint.startsWith("/api")) {
          fullUrl = `${apiPath}${queryString}`;
        } else {
          fullUrl = `${apiBaseUrl}${apiPath}${queryString}`;
        }
      } else {
        // Trong môi trường production, sử dụng API_SERVER trực tiếp
        if (endpoint.startsWith("/api")) {
          fullUrl = `${serverUrl}${apiPath}${queryString}`;
        } else {
          fullUrl = `${serverUrl}${apiBaseUrl}${apiPath}${queryString}`;
        }
      }
    }

    // Lấy token JWT từ localStorage (nếu có)
    const token = getToken();

    // Đối với API `/auth/me`, kiểm tra phiên đăng nhập trước khi gọi API
    if (endpoint === "/auth/me") {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      const savedUser = localStorage.getItem("auth_user");

      // Nếu không có token hoặc phiên đăng nhập, không cần gọi API
      if (!token || !isLoggedIn) {
        return Promise.reject(new Error("Authentication failed"));
      }

      // Nếu đã có thông tin user trong localStorage, kiểm tra xem token có hợp lệ không
      // bằng cách lấy thời gian hết hạn
      try {
        const tokenData = localStorage.getItem("auth_token");
        if (tokenData) {
          const { expiry } = JSON.parse(tokenData);

          // Nếu token còn hạn và đã có user, trả về dữ liệu từ localStorage để tránh request mạng
          if (expiry && expiry > Date.now() && savedUser) {
            return {
              data: { user: JSON.parse(savedUser) },
              success: true,
              message: "User info retrieved from cache",
              timestamp: new Date().toISOString(),
            } as unknown as TData;
          }
        }
      } catch (error) {
        console.error("Error parsing cached auth data", error);
      }
    }

    // Thêm token vào header nếu có
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      // Theo dõi API gọi
      console.log(
        `API ${options.method || "GET"} ${endpoint} - status: ${
          response.status
        }`
      );

      // Xử lý lỗi 401 Unauthorized (token hết hạn)
      if (
        response.status === 401 &&
        endpoint !== "/auth/refresh" &&
        endpoint !== "/auth/login"
      ) {
        console.log(
          `401 Unauthorized for ${endpoint}, attempting token refresh`
        );

        // Thử làm mới token
        const refreshSuccess = await handleTokenRefresh();

        if (refreshSuccess) {
          console.log(
            "Token refreshed successfully, retrying original request"
          );
          // Nếu làm mới token thành công, thử lại request với token mới
          return this.fetch<TData>(endpoint, params, options);
        } else {
          console.log("Token refresh failed, clearing auth state");
          // Xóa dữ liệu phiên đăng nhập
          sessionStorage.removeItem("isLoggedIn");
          // Nếu không thể làm mới token, ném lỗi xác thực
          throw new Error("Authentication failed");
        }
      }

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status} for ${endpoint}`);
        console.error(`Request URL: ${fullUrl}`);
        console.error(`Request params:`, params);

        try {
          // Thử đọc và log body của response lỗi
          const errorText = await response.text();
          console.error(`Response error body:`, errorText);
        } catch (e) {
          console.error(`Cannot read error response body:`, e);
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Nếu lỗi không phải do xác thực, ném lỗi gốc
      console.error(`API request error for ${endpoint}:`, error);

      // Ensure we're throwing a proper Error object
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "string") {
        throw new Error(error);
      } else {
        throw new Error(`Unknown error occurred while fetching ${endpoint}`);
      }
    }
  },

  /**
   * Phương thức GET
   * @param endpoint Endpoint API
   * @param options Tùy chọn bao gồm params và config fetch
   * @returns Promise với dữ liệu
   */
  async get<TData>(
    endpoint: string,
    options: { params?: QueryParams } = {}
  ): Promise<TData> {
    return this.fetch<TData>(endpoint, options.params, { method: "GET" });
  },

  /**
   * Phương thức POST
   * @param endpoint Endpoint API
   * @param data Dữ liệu gửi đi
   * @param params Tham số query (optional)
   * @returns Promise với dữ liệu
   */
  async post<TData, TRequestData = Record<string, unknown>>(
    endpoint: string,
    data?: TRequestData,
    params?: QueryParams
  ): Promise<TData> {
    return this.fetch<TData>(endpoint, params, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Phương thức PUT
   * @param endpoint Endpoint API
   * @param data Dữ liệu gửi đi
   * @param params Tham số query (optional)
   * @returns Promise với dữ liệu
   */
  async put<TData, TRequestData = Record<string, unknown>>(
    endpoint: string,
    data?: TRequestData,
    params?: QueryParams
  ): Promise<TData> {
    return this.fetch<TData>(endpoint, params, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Phương thức PATCH
   * @param endpoint Endpoint API
   * @param data Dữ liệu gửi đi
   * @param params Tham số query (optional)
   * @returns Promise với dữ liệu
   */
  async patch<TData, TRequestData = Record<string, unknown>>(
    endpoint: string,
    data?: TRequestData,
    params?: QueryParams
  ): Promise<TData> {
    return this.fetch<TData>(endpoint, params, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Phương thức DELETE
   * @param endpoint Endpoint API
   * @param params Tham số query (optional)
   * @returns Promise với dữ liệu
   */
  async delete<TData>(endpoint: string, params?: QueryParams): Promise<TData> {
    console.log(`DELETE request to ${endpoint} with params:`, params);
    return this.fetch<TData>(endpoint, params, { method: "DELETE" });
  },

  /**
   * Tạo resource cho Suspense
   * @param endpoint Endpoint API
   * @param params Tham số query (optional)
   * @param options Tùy chọn fetch (optional)
   * @returns Resource cho Suspense
   */
  createResource<TData>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestInit
  ): Resource<TData> {
    const promise = this.fetch<TData>(endpoint, params, options);
    return createResource(promise);
  },
};
