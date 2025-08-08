import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAppraisalCouncilList,
  getAppraisalCouncilListWithMembers,
  createAppraisalCouncil,
  updateAppraisalCouncil,
  deleteAppraisalCouncil,
} from "@/services/resources/appraisal-council";
import {
  AppraisalCouncilListRequest,
  CreateAppraisalCouncilRequest,
  UpdateAppraisalCouncilRequest,
} from "@/types/appraisal-council";

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
