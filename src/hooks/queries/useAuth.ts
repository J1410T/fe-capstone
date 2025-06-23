/**
 * Authentication-related React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { queryApi } from "@/api/query-client";
import { queryKeys } from "@/lib/react-query";
import { UserRole } from "@/contexts/auth-types";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  [key: string]: string;
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

/**
 * Hook to get current user information
 */
export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => queryApi.get<User>("/auth/me"),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === 401
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to login user
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      queryApi.post<LoginResponse>("/auth/login", credentials),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("isLoggedIn", "true");

      // Store user in cache
      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        accessToken,
      };

      queryClient.setQueryData(queryKeys.auth.me, userData);

      toast.success("Login successful");

      // Redirect based on role
      switch (user.role) {
        case UserRole.STAFF:
          navigate("/staff/dashboard");
          break;
        case UserRole.PRINCIPAL_INVESTIGATOR:
          navigate("/home");
          break;
        default:
          navigate("/home");
      }
    },
    onError: (error: unknown) => {
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Please check your credentials and try again";
      toast.error("Login failed", {
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook to logout user
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => queryApi.post("/auth/logout"),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      sessionStorage.removeItem("isLoggedIn");

      // Clear all cached data
      queryClient.clear();

      toast.success("Logged out successfully");
      navigate("/auth/login");
    },
    onError: (error: unknown) => {
      console.error("Logout error:", error);
      // Still clear local data even if API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      sessionStorage.removeItem("isLoggedIn");
      queryClient.clear();
      navigate("/auth/login");
    },
  });
};
