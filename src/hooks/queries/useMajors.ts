import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryApi } from "@/services/query-client";
import { toast } from "sonner";

// Major interface
export interface Major {
  id: string;
  name: string;
  field: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  projectCount?: number;
}

// Create major data interface
export interface CreateMajorData {
  name: string;
  fieldId: string;
}

// Update major data interface
export interface UpdateMajorData {
  name?: string;
  fieldId?: string;
}

// Query keys
export const majorQueryKeys = {
  all: ["majors"] as const,
  lists: () => [...majorQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, string | number | boolean | undefined>) => [...majorQueryKeys.lists(), { filters }] as const,
  details: () => [...majorQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...majorQueryKeys.details(), id] as const,
  byField: (fieldId: string) => [...majorQueryKeys.all, "by-field", fieldId] as const,
};

/**
 * Hook to fetch all majors
 */
export const useMajors = (filters?: Record<string, string | number | boolean | undefined>) => {
  return useQuery({
    queryKey: majorQueryKeys.list(filters),
    queryFn: () => queryApi.get<Major[]>("/majors", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single major by ID
 */
export const useMajor = (id: string, enabled = true) => {
  return useQuery({
    queryKey: majorQueryKeys.detail(id),
    queryFn: () => queryApi.get<Major>(`/majors/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

/**
 * Hook to fetch majors by field
 */
export const useMajorsByField = (fieldId: string, enabled = true) => {
  return useQuery({
    queryKey: majorQueryKeys.byField(fieldId),
    queryFn: () => queryApi.get<Major[]>(`/majors/by-field/${fieldId}`),
    enabled: enabled && !!fieldId,
    throwOnError: true,
  });
};

/**
 * Hook to create a new major
 */
export const useCreateMajor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMajorData) =>
      queryApi.post<Major, CreateMajorData>("/majors", data),
    onSuccess: (newMajor) => {
      // Invalidate and refetch majors list
      queryClient.invalidateQueries({ queryKey: majorQueryKeys.all });

      // Invalidate majors by field
      queryClient.invalidateQueries({ 
        queryKey: majorQueryKeys.byField(newMajor.field.id) 
      });

      // Add the new major to cache
      queryClient.setQueryData(
        majorQueryKeys.detail(newMajor.id),
        newMajor
      );

      toast.success("Major created successfully!", {
        description: `${newMajor.name} has been created.`,
      });
    },
    onError: (error) => {
      console.error("Failed to create major:", error);
      toast.error("Failed to create major", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to update a major
 */
export const useUpdateMajor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMajorData }) =>
      queryApi.put<Major, UpdateMajorData>(`/majors/${id}`, data),
    onSuccess: (updatedMajor) => {
      // Invalidate and refetch majors list
      queryClient.invalidateQueries({ queryKey: majorQueryKeys.all });

      // Invalidate majors by field
      queryClient.invalidateQueries({ 
        queryKey: majorQueryKeys.byField(updatedMajor.field.id) 
      });

      // Update the major in cache
      queryClient.setQueryData(
        majorQueryKeys.detail(updatedMajor.id),
        updatedMajor
      );

      toast.success("Major updated successfully!", {
        description: `${updatedMajor.name} has been updated.`,
      });
    },
    onError: (error) => {
      console.error("Failed to update major:", error);
      toast.error("Failed to update major", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to delete a major
 */
export const useDeleteMajor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/majors/${id}`),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch majors list
      queryClient.invalidateQueries({ queryKey: majorQueryKeys.all });

      // Remove the major from cache
      queryClient.removeQueries({ queryKey: majorQueryKeys.detail(deletedId) });

      toast.success("Major deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete major:", error);
      toast.error("Failed to delete major", {
        description: "Please try again",
      });
    },
  });
};
