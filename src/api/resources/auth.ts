/**
 * Authentication API resources
 */

import { api } from "../base";

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
    const refreshToken = localStorage.getItem("refreshToken");
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
