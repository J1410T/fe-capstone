import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AuthResponse,
  ResetPasswordRequest,
  SearchAccountsParams,
} from "@/types/auth";

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
  getUserRoleById,
  getUserFilter,
  getUserRoleByAccountId,
  createUser,
  updateUserStatus,
  getUserRolesByAppraisalCouncil,
  updateUserRole,
  getStaffList,
  getBaseUserRoleId,
  getPIUserRoleByProjectId,
  getAppraisalCouncilUserRoleByProjectId,
  getCreatorByProposalProjectId,
  getAllUserRoleAdmin,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getResearcherUserRoleByProjectId,
} from "@/services/resources/auth";
import {
  UserRole,
  UserRoleResponse,
  CreateUserRoleRequest,
  UpdateUserRoleRequest,
  UserRoleFilterRequest,
  UserFilterRequest,
  UserFilterResponse,
  UserAccountWithRoles,
  CreateUserRequest,
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

// export function useSearchAccounts(input: string) {
//   return useQuery({
//     queryKey: ["search-accounts", input],
//     queryFn: () => searchAccounts(input),
//     enabled: !!input && input.trim().length > 0, // Only search if input has at least 2 characters
//     staleTime: 30000, // Cache for 30 seconds
//   });
// }

export function useSearchAccounts(params: SearchAccountsParams) {
  return useQuery({
    queryKey: ["search-accounts", params.input, params.roleUser],
    queryFn: () => searchAccounts(params),
    enabled: !!params.input && params.input.trim().length > 0,
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

// Optimized useUserRolesByProjectId - only refetch every 2 minutes
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
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes only
    refetchIntervalInBackground: false, // Don't refetch in background to reduce API calls
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce API calls
    refetchOnMount: true, // Only refetch on initial mount
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
 * Hook to get user role by account ID and project ID - optimized for less frequent updates
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
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes instead of 5 seconds
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes instead of 3 seconds
    refetchIntervalInBackground: false, // Don't refetch in background
    refetchOnWindowFocus: false, // Don't refetch on window focus
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
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      queryClient.invalidateQueries({
        queryKey: ["user-roles-by-appraisal-council"],
      });
      queryClient.invalidateQueries({
        queryKey: ["appraisal-councils"],
      });
    },
    onError: (error) => {
      console.error("Failed to create user role:", error);
      // Let the component handle the error display
    },
  });
}

export function useUserRolesByAppraisalCouncil(
  appraisalCouncilId: string,
  pageIndex: number = 1,
  pageSize: number = 100
) {
  return useQuery({
    queryKey: [
      "user-roles-by-appraisal-council",
      appraisalCouncilId,
      pageIndex,
      pageSize,
    ],
    queryFn: () =>
      getUserRolesByAppraisalCouncil(appraisalCouncilId, pageIndex, pageSize),
    enabled: !!appraisalCouncilId,
    staleTime: 30000, // Cache for 30 seconds
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
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
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
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
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

export function useGetUserRoleById(userRoleId: string) {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["get-user-role-by-id", userRoleId],
    queryFn: () => getUserRoleById(userRoleId),
    enabled: !!userRoleId && !!accessToken,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// New hooks for Users Management

/**
 * Hook to get users with filter and pagination
 */
export function useUserFilter(request: UserFilterRequest) {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["user-filter", request],
    queryFn: () => getUserFilter(request),
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

/**
 * Hook to get user roles by account ID
 */
export function useUserRoleByAccountId(
  accountId: string,
  enabled: boolean = true
) {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["user-role-by-account", accountId],
    queryFn: () => getUserRoleByAccountId(accountId),
    enabled: !!accountId && !!accessToken && enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateUserRequest) => createUser(request),
    onSuccess: () => {
      // Invalidate user filter queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["user-filter"] });
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });
}

/**
 * Hook to update user status
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => updateUserStatus(accountId),
    onSuccess: () => {
      // Invalidate user filter queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["user-filter"] });
      queryClient.invalidateQueries({ queryKey: ["user-role-by-account"] });
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
    },
    onError: (error) => {
      console.error("Failed to update user status:", error);
    },
  });
}

/**
 * Hook to get users with their roles - enhanced version that combines user filter with role data
 */
export function useUsersWithRoles(request: UserFilterRequest) {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["users-with-roles", request],
    queryFn: async (): Promise<
      UserFilterResponse & { "data-list": UserAccountWithRoles[] }
    > => {
      // First get the users
      const userResponse = await getUserFilter(request);

      // Valid role names to filter
      const validRoles = [
        "Researcher",
        "Principal Investigator",
        "Staff",
        "Appraisal Council",
        "Host Institution",
      ];

      // For each user, get their roles
      const usersWithRoles = await Promise.all(
        userResponse["data-list"].map(async (user) => {
          try {
            const rolesResponse = await getUserRoleByAccountId(user.id);

            // Filter and deduplicate roles, only keep valid ones
            const uniqueValidRoles = rolesResponse["data-list"]
              .filter((role) => validRoles.includes(role.name))
              .reduce((acc, role) => {
                if (!acc.find((r) => r.name === role.name)) {
                  acc.push({
                    id: role.id,
                    "role-id": role["role-id"],
                    name: role.name,
                  });
                }
                return acc;
              }, [] as Array<{ id: string; "role-id": string; name: string }>);

            return {
              ...user,
              UserRole: uniqueValidRoles,
            };
          } catch (error) {
            console.error(`Failed to get roles for user ${user.id}:`, error);
            return {
              ...user,
              UserRole: [],
            };
          }
        })
      );

      return {
        ...userResponse,
        "data-list": usersWithRoles,
      };
    },
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

export function useUpdateUserRole() {
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
    }) => updateUserRole(userRoleId, status, request),
    onSuccess: () => {
      // Invalidate user role and related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["user-role"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({
        queryKey: ["user-roles-by-appraisal-council"],
      });
      queryClient.invalidateQueries({ queryKey: ["appraisal-councils"] });
    },
    onError: (error) => {
      console.error("Failed to update user role:", error);
    },
  });
}

/**
 * Hook to get user roles by account ID for role management
 */
export function useUserRolesByAccountId(
  accountId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["user-roles-by-account", accountId],
    queryFn: () => getUserRoleByAccountId(accountId),
    enabled: enabled && !!accountId,
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useStaffList() {
  return useQuery({
    queryKey: ["user-roles-staff-list"],
    queryFn: () => getStaffList(),
    staleTime: 30000,
  });
}

export function useBaseUserRoleId() {
  return useQuery({
    queryKey: ["base-user-role-id"],
    queryFn: () => getBaseUserRoleId(),
    staleTime: 30000,
  });
}

export function usePIUserRoleByProjectId(projectId: string) {
  return useQuery({
    queryKey: ["pi-user-role-by-project", projectId],
    queryFn: () => getPIUserRoleByProjectId(projectId),
    enabled: !!projectId,
    staleTime: 30000,
  });
}

export function useResearcherUserRoleByProjectId(projectId: string) {
  return useQuery({
    queryKey: ["pi-user-role-by-project", projectId],
    queryFn: () => getResearcherUserRoleByProjectId(projectId),
    enabled: !!projectId,
    staleTime: 30000,
  });
}

export function useAppraisalCouncilUserRoleByProjectId(projectId: string) {
  return useQuery({
    queryKey: ["appraisal-council-user-role-by-project", projectId],
    queryFn: () => getAppraisalCouncilUserRoleByProjectId(projectId),
    enabled: !!projectId,
    staleTime: 30000,
  });
}

export function useCreatorByProposalProjectId(projectId: string) {
  return useQuery({
    queryKey: ["creator-by-proposal-project", projectId],
    queryFn: () => getCreatorByProposalProjectId(projectId),
    enabled: !!projectId,
    staleTime: 30000,
  });
}

export function useAllUserRoleAdmin() {
  return useQuery({
    queryKey: ["all-user-role-admin"],
    queryFn: () => getAllUserRoleAdmin(),
    staleTime: 30000,
  });
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
  });
};
