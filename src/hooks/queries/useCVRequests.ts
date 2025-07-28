import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryApi } from "@/services/query-client";

// CV Request Status Types
export type CVRequestStatus = "pending" | "approved" | "rejected" | "none";

// CV Request Interface
export interface CVRequest {
  id: string;
  requesterId: string;
  targetUserId: string;
  status: CVRequestStatus;
  requestedAt: string;
  respondedAt?: string;
  message?: string;
  projectId?: string;
}

// Query keys for CV requests
export const cvRequestQueryKeys = {
  all: ["cv-requests"] as const,
  lists: () => [...cvRequestQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...cvRequestQueryKeys.lists(), { filters }] as const,
  details: () => [...cvRequestQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...cvRequestQueryKeys.details(), id] as const,
  byUser: (userId: string) =>
    [...cvRequestQueryKeys.all, "by-user", userId] as const,
  byProject: (projectId: string) =>
    [...cvRequestQueryKeys.all, "by-project", projectId] as const,
};

/**
 * Hook to fetch CV requests with optional filters
 */
export const useCVRequests = (
  filters?: Record<string, string | number | boolean | undefined>
) => {
  return useQuery({
    queryKey: cvRequestQueryKeys.list(filters),
    queryFn: () => queryApi.getPaginated<CVRequest>("/cv-requests", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single CV request by ID
 */
export const useCVRequest = (id: string, enabled = true) => {
  return useQuery({
    queryKey: cvRequestQueryKeys.detail(id),
    queryFn: () => queryApi.get<CVRequest>(`/cv-requests/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

/**
 * Hook to fetch CV requests by user
 */
export const useCVRequestsByUser = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: cvRequestQueryKeys.byUser(userId),
    queryFn: () => queryApi.get<CVRequest[]>(`/cv-requests/user/${userId}`),
    enabled: enabled && !!userId,
    throwOnError: true,
  });
};

/**
 * Hook to fetch CV requests by project
 */
export const useCVRequestsByProject = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: cvRequestQueryKeys.byProject(projectId),
    queryFn: () =>
      queryApi.get<CVRequest[]>(`/cv-requests/project/${projectId}`),
    enabled: enabled && !!projectId,
    throwOnError: true,
  });
};

/**
 * Hook to create a new CV request
 */
export const useCreateCVRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      targetUserId: string;
      message?: string;
      projectId?: string;
    }) => queryApi.post<CVRequest>("/cv-requests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvRequestQueryKeys.all });
    },
  });
};

/**
 * Hook to update CV request status
 */
export const useUpdateCVRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: string;
      status: CVRequestStatus;
      message?: string;
    }) =>
      queryApi.patch<CVRequest>(`/cv-requests/${data.id}/status`, {
        status: data.status,
        message: data.message,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cvRequestQueryKeys.all });
      queryClient.setQueryData(cvRequestQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to delete a CV request
 */
export const useDeleteCVRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/cv-requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvRequestQueryKeys.all });
    },
  });
};

/**
 * Mock function to simulate CV request creation
 * In a real application, this would be replaced by actual API calls
 */
export const mockCreateCVRequest = async (
  targetUserId: string,
  projectId?: string
): Promise<CVRequest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRequest: CVRequest = {
        id: `cv-req-${Date.now()}`,
        requesterId: "current-user-id", // In real app, this would come from auth context
        targetUserId,
        status: "pending",
        requestedAt: new Date().toISOString(),
        projectId,
        message: "Please share your Scientific CV for project collaboration.",
      };
      resolve(mockRequest);
    }, 500);
  });
};

/**
 * Mock function to simulate CV request status update
 */
export const mockUpdateCVRequestStatus = async (
  requestId: string,
  status: CVRequestStatus
): Promise<CVRequest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRequest: CVRequest = {
        id: requestId,
        requesterId: "current-user-id",
        targetUserId: "target-user-id",
        status,
        requestedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        respondedAt: new Date().toISOString(),
        message:
          status === "approved"
            ? "CV request approved and shared."
            : status === "rejected"
            ? "CV request declined."
            : "CV request is pending review.",
      };
      resolve(mockRequest);
    }, 300);
  });
};
