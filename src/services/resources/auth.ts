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
    const response = await axiosClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
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
    const accessToken = getAccessToken();
    const response = await axiosClient.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    const accessToken = getAccessToken();
    const response = await axiosClient.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },
};
