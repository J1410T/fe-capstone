/**
 * Enhanced API client for TanStack Query
 */

import { api, type QueryParams } from "./base";
import { ApiError } from "@/lib/react-query";

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
    options?: RequestInit
  ): Promise<TData> {
    try {
      const response = await api.fetch<{
        success: boolean;
        data: TData;
        message?: string;
      }>(endpoint, params, {
        method: "GET",
        ...options,
      });

      if (!response.success) {
        throw new ApiError(400, response, response.message);
      }

      return response.data;
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        throw new ApiError(
          error.status,
          errorData,
          errorData.message || error.statusText
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
      const response = await api.fetch<{
        success: boolean;
        data: TData;
        message?: string;
      }>(endpoint, params, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.success) {
        throw new ApiError(400, response, response.message);
      }

      return response.data;
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        throw new ApiError(
          error.status,
          errorData,
          errorData.message || error.statusText
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
      const response = await api.fetch<{
        success: boolean;
        data: TData;
        message?: string;
      }>(endpoint, params, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.success) {
        throw new ApiError(400, response, response.message);
      }

      return response.data;
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        throw new ApiError(
          error.status,
          errorData,
          errorData.message || error.statusText
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
      const response = await api.fetch<{
        success: boolean;
        data: TData;
        message?: string;
      }>(endpoint, params, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.success) {
        throw new ApiError(400, response, response.message);
      }

      return response.data;
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        throw new ApiError(
          error.status,
          errorData,
          errorData.message || error.statusText
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
      const response = await api.fetch<{
        success: boolean;
        data: TData;
        message?: string;
      }>(endpoint, params, {
        method: "DELETE",
      });

      if (!response.success) {
        throw new ApiError(400, response, response.message);
      }

      return response.data;
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        throw new ApiError(
          error.status,
          errorData,
          errorData.message || error.statusText
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
      const response = await api.fetch<{
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
      }>(endpoint, params, {
        method: "GET",
      });

      if (!response.success) {
        throw new ApiError(400, response, response.message);
      }

      return {
        data: response.data,
        pagination: response.pagination,
        meta: response.meta,
      };
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        throw new ApiError(
          error.status,
          errorData,
          errorData.message || error.statusText
        );
      }
      throw error;
    }
  },
};
