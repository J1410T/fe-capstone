import { useQuery, useMutation } from "@tanstack/react-query";
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
} from "@/services/resources/auth";

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
