import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryApi } from "@/services/query-client";
import { toast } from "sonner";

// AppraisalCouncil interface
export interface AppraisalCouncil {
  id: string;
  code: string;
  name: string;
  status: "created" | "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

// Create appraisal council data interface
export interface CreateAppraisalCouncilData {
  code: string;
  name: string;
  status?: AppraisalCouncil["status"];
}

// Update appraisal council data interface
export interface UpdateAppraisalCouncilData {
  code?: string;
  name?: string;
  status?: AppraisalCouncil["status"];
}

// Query keys
export const appraisalCouncilQueryKeys = {
  all: ["appraisal-councils"] as const,
  lists: () => [...appraisalCouncilQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, string | number | boolean | undefined>) => [...appraisalCouncilQueryKeys.lists(), { filters }] as const,
  details: () => [...appraisalCouncilQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...appraisalCouncilQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all appraisal councils
 */
export const useAppraisalCouncils = (filters?: Record<string, string | number | boolean | undefined>) => {
  return useQuery({
    queryKey: appraisalCouncilQueryKeys.list(filters),
    queryFn: () => queryApi.get<AppraisalCouncil[]>("/appraisal-councils", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single appraisal council by ID
 */
export const useAppraisalCouncil = (id: string, enabled = true) => {
  return useQuery({
    queryKey: appraisalCouncilQueryKeys.detail(id),
    queryFn: () => queryApi.get<AppraisalCouncil>(`/appraisal-councils/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

/**
 * Hook to create a new appraisal council
 */
export const useCreateAppraisalCouncil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppraisalCouncilData) =>
      queryApi.post<AppraisalCouncil, CreateAppraisalCouncilData>("/appraisal-councils", data),
    onSuccess: (newCouncil) => {
      // Invalidate and refetch councils list
      queryClient.invalidateQueries({ queryKey: appraisalCouncilQueryKeys.all });

      // Add the new council to cache
      queryClient.setQueryData(
        appraisalCouncilQueryKeys.detail(newCouncil.id),
        newCouncil
      );

      toast.success("Appraisal Council created successfully!", {
        description: `${newCouncil.name} has been created.`,
      });
    },
    onError: (error) => {
      console.error("Failed to create appraisal council:", error);
      toast.error("Failed to create appraisal council", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to update an appraisal council
 */
export const useUpdateAppraisalCouncil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppraisalCouncilData }) =>
      queryApi.put<AppraisalCouncil, UpdateAppraisalCouncilData>(`/appraisal-councils/${id}`, data),
    onSuccess: (updatedCouncil) => {
      // Invalidate and refetch councils list
      queryClient.invalidateQueries({ queryKey: appraisalCouncilQueryKeys.all });

      // Update the council in cache
      queryClient.setQueryData(
        appraisalCouncilQueryKeys.detail(updatedCouncil.id),
        updatedCouncil
      );

      toast.success("Appraisal Council updated successfully!", {
        description: `${updatedCouncil.name} has been updated.`,
      });
    },
    onError: (error) => {
      console.error("Failed to update appraisal council:", error);
      toast.error("Failed to update appraisal council", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to delete an appraisal council
 */
export const useDeleteAppraisalCouncil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/appraisal-councils/${id}`),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch councils list
      queryClient.invalidateQueries({ queryKey: appraisalCouncilQueryKeys.all });

      // Remove the council from cache
      queryClient.removeQueries({ queryKey: appraisalCouncilQueryKeys.detail(deletedId) });

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
