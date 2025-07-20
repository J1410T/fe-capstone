import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryApi } from "@/services/query-client";
import { toast } from "sonner";

// Field interface
export interface Field {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  majorCount?: number;
}

// Create field data interface
export interface CreateFieldData {
  name: string;
}

// Update field data interface
export interface UpdateFieldData {
  name?: string;
}

// Query keys
export const fieldQueryKeys = {
  all: ["fields"] as const,
  lists: () => [...fieldQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, string | number | boolean | undefined>) => [...fieldQueryKeys.lists(), { filters }] as const,
  details: () => [...fieldQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...fieldQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch all fields
 */
export const useFields = (filters?: Record<string, string | number | boolean | undefined>) => {
  return useQuery({
    queryKey: fieldQueryKeys.list(filters),
    queryFn: () => queryApi.get<Field[]>("/fields", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single field by ID
 */
export const useField = (id: string, enabled = true) => {
  return useQuery({
    queryKey: fieldQueryKeys.detail(id),
    queryFn: () => queryApi.get<Field>(`/fields/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

/**
 * Hook to create a new field
 */
export const useCreateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFieldData) =>
      queryApi.post<Field, CreateFieldData>("/fields", data),
    onSuccess: (newField) => {
      // Invalidate and refetch fields list
      queryClient.invalidateQueries({ queryKey: fieldQueryKeys.all });

      // Add the new field to cache
      queryClient.setQueryData(
        fieldQueryKeys.detail(newField.id),
        newField
      );

      toast.success("Field created successfully!", {
        description: `${newField.name} has been created.`,
      });
    },
    onError: (error) => {
      console.error("Failed to create field:", error);
      toast.error("Failed to create field", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to update a field
 */
export const useUpdateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFieldData }) =>
      queryApi.put<Field, UpdateFieldData>(`/fields/${id}`, data),
    onSuccess: (updatedField) => {
      // Invalidate and refetch fields list
      queryClient.invalidateQueries({ queryKey: fieldQueryKeys.all });

      // Update the field in cache
      queryClient.setQueryData(
        fieldQueryKeys.detail(updatedField.id),
        updatedField
      );

      toast.success("Field updated successfully!", {
        description: `${updatedField.name} has been updated.`,
      });
    },
    onError: (error) => {
      console.error("Failed to update field:", error);
      toast.error("Failed to update field", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to delete a field
 */
export const useDeleteField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/fields/${id}`),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch fields list
      queryClient.invalidateQueries({ queryKey: fieldQueryKeys.all });

      // Remove the field from cache
      queryClient.removeQueries({ queryKey: fieldQueryKeys.detail(deletedId) });

      toast.success("Field deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete field:", error);
      toast.error("Failed to delete field", {
        description: "Please try again",
      });
    },
  });
};
