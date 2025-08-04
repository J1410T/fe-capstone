import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse } from "@/types/auth";

import {
  getAuthResponse,
  setAuthResponse,
  setAccessToken,
} from "@/utils/cookie-manager";
import { getAccessToken } from "@/services";
import {
  getAccountById,
  getAllRoles,
  getMyAccountInfo,
  getRoleById,
  getUserRolesByProjectId,
  searchAccounts,
  setMyRole,
  getUserRoleByFilter,
  createUserRole,
  updateUserRoleStatus,
  deleteUserRole,
} from "@/services/resources/auth";
import {
  UserRole,
  UserRoleResponse,
  CreateUserRoleRequest,
  UpdateUserRoleRequest,
  UserRoleFilterRequest,
} from "@/types/auth";

export function useAuthResponse() {
  const data = getAuthResponse<AuthResponse>();
  return { data };
}

export function useMyAccountInfo() {
  return useQuery({
    queryKey: ["account-info"],
    queryFn: getMyAccountInfo,
  });
}

export function useAccessToken() {
  const token = getAccessToken();
  return token;
}

export function useAccountInfo(accountId: string) {
  return useQuery({
    queryKey: ["account-info", accountId],
    queryFn: () => getAccountById(accountId),
    enabled: !!accountId,
  });
}

export function useRoleInfo(roleId: string) {
  return useQuery({
    queryKey: ["role-info", roleId],
    queryFn: () => getRoleById(roleId),
    enabled: !!roleId,
  });
}

/**
 * Mutation hook for switching user role
 * Calls the API and updates the auth-response data
 */
export function useSetMyRole() {
  return useMutation({
    mutationFn: (roleName: string) => setMyRole(roleName),
    onSuccess: (response) => {
      // Update the auth-response data with the new response from API
      if (response.data) {
        setAuthResponse(response.data);

        // Update the access token cookie with the new token from the auth response
        if (response.data.token) {
          setAccessToken(response.data.token);
          console.log("🔄 Access token updated after role switch");
        }
      }
    },
    onError: (error) => {
      console.error("Failed to switch role:", error);
    },
  });
}

export function useSearchAccounts(input: string) {
  return useQuery({
    queryKey: ["search-accounts", input],
    queryFn: () => searchAccounts(input),
    enabled: !!input && input.trim().length > 0, // Only search if input has at least 2 characters
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useAllRoles() {
  return useQuery({
    queryKey: ["all-roles"],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useUserRolesByProjectId(
  projectId: string,
  pageIndex: number = 1,
  pageSize: number = 100
) {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["user-roles", projectId, pageIndex, pageSize],
    queryFn: () => getUserRolesByProjectId(projectId, pageIndex, pageSize),
    enabled: !!projectId && !!accessToken,
  });
}

export function useUserRoleById(userRoleId: string) {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["user-role", userRoleId],
    queryFn: () =>
      import("@/services/resources/auth").then(({ getUserRoleById }) =>
        getUserRoleById(userRoleId)
      ),
    enabled: !!userRoleId && !!accessToken,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to get user role by account ID and project ID with real-time updates
 */
export function useUserRoleByAccountAndProject(
  accountId: string,
  projectId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["user-role", accountId, projectId],
    queryFn: async (): Promise<UserRole[] | null> => {
      if (!accountId || !projectId) return null;

      const request: UserRoleFilterRequest = {
        "account-id": accountId,
        "project-id": projectId,
        "page-index": 1,
        "page-size": 10,
      };

      const response: UserRoleResponse = await getUserRoleByFilter(request);

      // Return all user roles found (to handle cases with multiple roles)
      return response["data-list"] || [];
    },
    enabled: !!accountId && !!projectId && enabled,
    staleTime: 5000, // Cache for 5 seconds for real-time updates
    refetchInterval: 3000, // Refetch every 3 seconds for immediate status updates
    refetchIntervalInBackground: true, // Continue refetching in background
  });
}
/**
 * Hook to create a user role
 */
export function useCreateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateUserRoleRequest) => createUserRole(request),
    onSuccess: () => {
      // Invalidate user role queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["user-role"] });
    },
    onError: (error) => {
      console.error("Failed to create user role:", error);
    },
  });
}

/**
 * Hook to update user role status
 */
export function useUpdateUserRoleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userRoleId,
      status,
      request,
    }: {
      userRoleId: string;
      status: string;
      request: UpdateUserRoleRequest;
    }) => updateUserRoleStatus(userRoleId, status, request),
    onSuccess: () => {
      // Invalidate user role and all notification queries to refresh data across all tabs
      queryClient.invalidateQueries({ queryKey: ["user-role"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Also refetch all notification queries to ensure immediate updates across all tabs
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Failed to update user role status:", error);
    },
  });
}

/**
 * Hook to delete a user role
 */
export function useDeleteUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userRoleId: string) => deleteUserRole(userRoleId),
    onSuccess: () => {
      // Invalidate user role and all notification queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["user-role"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      // Also refetch all queries to ensure immediate updates
      queryClient.refetchQueries({ queryKey: ["notifications"] });
      queryClient.refetchQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      console.error("Failed to delete user role:", error);
    },
  });
}
