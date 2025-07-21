import { axiosClient, getAccessToken } from "../api";

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
    // Note: Refresh token functionality needs to be implemented with cookies
    // For now, throw an error to indicate this needs implementation
    throw new Error(
      "Refresh token functionality needs to be implemented with cookie storage"
    );
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
