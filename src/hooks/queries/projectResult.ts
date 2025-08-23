import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProjectResult,
  createProjectResult,
  updateProjectResult,
  deleteProjectResult,
  uploadFileToAzure,
  type ProjectResult,
  type ResultPublish,
  type ProjectResultResponse,
  type ProjectResultListResponse,
} from "@/services/resources/projectResult";

// React Query hooks
export const useProjectResult = (
  projectId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["project-result", projectId],
    queryFn: () => getProjectResult(projectId),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateProjectResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectResult,
    onSuccess: (_, variables) => {
      // Invalidate specific project result query
      queryClient.invalidateQueries({
        queryKey: ["project-result", variables["project-id"]],
      });
      // Also invalidate general project result queries
      queryClient.invalidateQueries({ queryKey: ["project-result"] });
      toast.success("Project result created successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to create project result:", error);
      toast.error(error.message || "Failed to create project result");
    },
  });
};

export const useUpdateProjectResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectResult,
    onSuccess: (data) => {
      // Invalidate specific project result query
      queryClient.invalidateQueries({
        queryKey: ["project-result", data.data["project-id"]],
      });
      // Also invalidate general project result queries
      queryClient.invalidateQueries({ queryKey: ["project-result"] });
      toast.success("Project result updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to update project result:", error);
      toast.error(error.message || "Failed to update project result");
    },
  });
};

export const useDeleteProjectResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectResult,
    onSuccess: () => {
      // Invalidate all project result queries
      queryClient.invalidateQueries({ queryKey: ["project-result"] });
      toast.success("Project result deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to delete project result:", error);
      toast.error(error.message || "Failed to delete project result");
    },
  });
};

export const useUploadFileToAzure = () => {
  return useMutation({
    mutationFn: uploadFileToAzure,
    onSuccess: () => {
      toast.success("File uploaded successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to upload file:", error);
      toast.error(error.message || "Failed to upload file");
    },
  });
};

// Export types for use in components
export type {
  ProjectResult,
  ResultPublish,
  ProjectResultResponse,
  ProjectResultListResponse,
};
