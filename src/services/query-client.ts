/**
 * Enhanced API client for TanStack Query
 */

import { axiosClient, getAccessToken } from "./api";
import { ApiError } from "@/lib/react-query";

export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Enhanced API client with TanStack Query integration
 */
export const queryApi = {
  /**
   * GET request optimized for queries
   */
  async get<TData>(
    endpoint: string,
    params?: QueryParams,
    options?: any
  ): Promise<TData> {
    try {
      const accessToken = getAccessToken();

      // Build query string from params
      const queryString = params
        ? new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            }, {} as Record<string, string>)
          ).toString()
        : "";

      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await axiosClient.get<{
        success: boolean;
        data: TData;
        message?: string;
      }>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.data.success) {
        throw new ApiError(400, response.data, response.data.message);
      }

      return response.data.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: Record<string, unknown> };
        };
        const errorData = axiosError.response.data || {};
        throw new ApiError(
          axiosError.response.status,
          errorData,
          typeof errorData.message === "string"
            ? errorData.message
            : "API Error"
        );
      }
      throw error;
    }
  },

  /**
   * POST request optimized for mutations
   */
  async post<TData, TRequestData = Record<string, unknown>>(
    endpoint: string,
    data?: TRequestData,
    params?: QueryParams
  ): Promise<TData> {
    try {
      const accessToken = getAccessToken();

      // Build query string from params
      const queryString = params
        ? new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            }, {} as Record<string, string>)
          ).toString()
        : "";

      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await axiosClient.post<{
        success: boolean;
        data: TData;
        message?: string;
      }>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new ApiError(400, response.data, response.data.message);
      }

      return response.data.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: Record<string, unknown> };
        };
        const errorData = axiosError.response.data || {};
        throw new ApiError(
          axiosError.response.status,
          errorData,
          typeof errorData.message === "string"
            ? errorData.message
            : "API Error"
        );
      }
      throw error;
    }
  },

  /**
   * PUT request optimized for mutations
   */
  async put<TData, TRequestData = Record<string, unknown>>(
    endpoint: string,
    data?: TRequestData,
    params?: QueryParams
  ): Promise<TData> {
    try {
      const accessToken = getAccessToken();

      // Build query string from params
      const queryString = params
        ? new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            }, {} as Record<string, string>)
          ).toString()
        : "";

      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await axiosClient.put<{
        success: boolean;
        data: TData;
        message?: string;
      }>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new ApiError(400, response.data, response.data.message);
      }

      return response.data.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: Record<string, unknown> };
        };
        const errorData = axiosError.response.data || {};
        throw new ApiError(
          axiosError.response.status,
          errorData,
          typeof errorData.message === "string"
            ? errorData.message
            : "API Error"
        );
      }
      throw error;
    }
  },

  /**
   * PATCH request optimized for mutations
   */
  async patch<TData, TRequestData = Record<string, unknown>>(
    endpoint: string,
    data?: TRequestData,
    params?: QueryParams
  ): Promise<TData> {
    try {
      const accessToken = getAccessToken();

      // Build query string from params
      const queryString = params
        ? new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            }, {} as Record<string, string>)
          ).toString()
        : "";

      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await axiosClient.patch<{
        success: boolean;
        data: TData;
        message?: string;
      }>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new ApiError(400, response.data, response.data.message);
      }

      return response.data.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: Record<string, unknown> };
        };
        const errorData = axiosError.response.data || {};
        throw new ApiError(
          axiosError.response.status,
          errorData,
          typeof errorData.message === "string"
            ? errorData.message
            : "API Error"
        );
      }
      throw error;
    }
  },

  /**
   * DELETE request optimized for mutations
   */
  async delete<TData>(endpoint: string, params?: QueryParams): Promise<TData> {
    try {
      const accessToken = getAccessToken();

      // Build query string from params
      const queryString = params
        ? new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            }, {} as Record<string, string>)
          ).toString()
        : "";

      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await axiosClient.delete<{
        success: boolean;
        data: TData;
        message?: string;
      }>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data.success) {
        throw new ApiError(400, response.data, response.data.message);
      }

      return response.data.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: Record<string, unknown> };
        };
        const errorData = axiosError.response.data || {};
        throw new ApiError(
          axiosError.response.status,
          errorData,
          typeof errorData.message === "string"
            ? errorData.message
            : "API Error"
        );
      }
      throw error;
    }
  },

  /**
   * Paginated GET request
   */
  async getPaginated<TData>(
    endpoint: string,
    params?: QueryParams & {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<{
    data: TData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    meta?: Record<string, unknown>;
  }> {
    try {
      const accessToken = getAccessToken();

      // Build query string from params
      const queryString = params
        ? new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            }, {} as Record<string, string>)
          ).toString()
        : "";

      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const response = await axiosClient.get<{
        success: boolean;
        data: TData[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
        meta?: Record<string, unknown>;
        message?: string;
      }>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data.success) {
        throw new ApiError(400, response.data, response.data.message);
      }

      return {
        data: response.data.data,
        pagination: response.data.pagination,
        meta: response.data.meta,
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: Record<string, unknown> };
        };
        const errorData = axiosError.response.data || {};
        throw new ApiError(
          axiosError.response.status,
          errorData,
          typeof errorData.message === "string"
            ? errorData.message
            : "API Error"
        );
      }
      throw error;
    }
  },
};
