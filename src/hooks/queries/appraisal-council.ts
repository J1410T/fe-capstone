import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAppraisalCouncilList,
  getAppraisalCouncilListWithMembers,
  createAppraisalCouncil,
  updateAppraisalCouncil,
  deleteAppraisalCouncil,
  getAppraisalCouncilByProjectId,
  assignAppraisalCouncilToProject,
  getMyAppraisalCouncils,
} from "@/services/resources/appraisal-council";
import {
  AppraisalCouncilListRequest,
  CreateAppraisalCouncilRequest,
  UpdateAppraisalCouncilRequest,
  AssignCouncilToProjectRequest,
  MyAppraisalCouncilRequest,
} from "@/types/appraisal-council";
import { getUserRolesByAppraisalCouncil } from "@/services/resources/auth";

// Query keys
export const appraisalCouncilQueryKeys = {
  all: ["appraisal-councils"] as const,
  lists: () => [...appraisalCouncilQueryKeys.all, "list"] as const,
  list: (request?: AppraisalCouncilListRequest) =>
    [...appraisalCouncilQueryKeys.lists(), { request }] as const,
  details: () => [...appraisalCouncilQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...appraisalCouncilQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch appraisal councils list with pagination and search
 */
export const useAppraisalCouncilsList = (
  request: AppraisalCouncilListRequest
) => {
  return useQuery({
    queryKey: appraisalCouncilQueryKeys.list(request),
    queryFn: () => getAppraisalCouncilListWithMembers(request),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to fetch appraisal councils list without members (for basic operations)
 */
export const useAppraisalCouncilsListBasic = (
  request: AppraisalCouncilListRequest
) => {
  return useQuery({
    queryKey: [...appraisalCouncilQueryKeys.list(request), "basic"],
    queryFn: () => getAppraisalCouncilList(request),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to create a new appraisal council
 */
export const useCreateAppraisalCouncil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppraisalCouncilRequest) =>
      createAppraisalCouncil(data),
    onSuccess: () => {
      // Invalidate and refetch councils list
      queryClient.invalidateQueries({
        queryKey: appraisalCouncilQueryKeys.all,
      });
    },
    onError: (error) => {
      console.error("Failed to create appraisal council:", error);
    },
  });
};

/**
 * Hook to update an appraisal council
 */
export const useUpdateAppraisalCouncil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAppraisalCouncilRequest) =>
      updateAppraisalCouncil(data),
    onSuccess: () => {
      // Invalidate and refetch councils list
      queryClient.invalidateQueries({
        queryKey: appraisalCouncilQueryKeys.all,
      });
    },
    onError: (error) => {
      console.error("Failed to update appraisal council:", error);
    },
  });
};

/**
 * Hook to delete an appraisal council
 */
export const useDeleteAppraisalCouncil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAppraisalCouncil(id),
    onSuccess: () => {
      // Invalidate and refetch councils list
      queryClient.invalidateQueries({
        queryKey: appraisalCouncilQueryKeys.all,
      });

      toast.success("Appraisal Council deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete appraisal council:", error);
      toast.error("Failed to delete appraisal council", {
        description: "Please try again",
      });
    },
  });
};

/**
 * Hook to get appraisal council by project ID
 */
export const useAppraisalCouncilByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: [...appraisalCouncilQueryKeys.all, "by-project", projectId],
    queryFn: () => getAppraisalCouncilByProjectId(projectId),
    enabled: !!projectId,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404 errors (no council assigned)
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return false;
        }
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to get user roles by appraisal council ID
 */
export const useUserRolesByAppraisalCouncil = (
  councilId: string,
  pageIndex: number = 1,
  pageSize: number = 100
) => {
  return useQuery({
    queryKey: [
      ...appraisalCouncilQueryKeys.all,
      "members",
      councilId,
      pageIndex,
      pageSize,
    ],
    queryFn: () =>
      getUserRolesByAppraisalCouncil(councilId, pageIndex, pageSize),
    enabled: !!councilId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to assign appraisal council to project
 */
export const useAssignAppraisalCouncilToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignCouncilToProjectRequest) =>
      assignAppraisalCouncilToProject(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: [
          ...appraisalCouncilQueryKeys.all,
          "by-project",
          variables.sourceProjectId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: appraisalCouncilQueryKeys.all,
      });

      toast.success("Appraisal Council assigned successfully!");
    },
    onError: (error) => {
      console.error("Failed to assign appraisal council:", error);
      toast.error("Failed to assign appraisal council", {
        description: "Please try again",
      });
    },
  });
};

export const useMyAppraisalCouncils = (request: MyAppraisalCouncilRequest) => {
  return useQuery({
    queryKey: [...appraisalCouncilQueryKeys.all, "my-councils", request],
    queryFn: () => getMyAppraisalCouncils(request),
    staleTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });
};
