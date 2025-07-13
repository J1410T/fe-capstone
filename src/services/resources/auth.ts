import { axiosClient, getAccessToken } from "../api";
import { queryClient } from "@/lib/react-query"; // đây là queryClient đã cấu hình sẵn

export const getAccountInfo = async () => {
  try {
    const accessToken = getAccessToken();

    const res = await axiosClient.get<AuthInfo>("/account/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("getAccountInfo error:", error);
    throw error;
  }
};

/**
 * Authentication API resources
 */

import { api } from "../base";
import { AuthInfo } from "@/types/auth";

export interface LoginRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>("/auth/login", credentials);
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = queryClient.getQueryData(["refresh-token"]) as
      | string
      | undefined;
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    return api.post<RefreshTokenResponse>("/auth/refresh", {
      refreshToken,
    });
  },

  /**
   * Get current user info
   */
  async me() {
    return api.get("/auth/me");
  },

  /**
   * Logout user
   */
  async logout() {
    return api.post("/auth/logout");
  },
};
