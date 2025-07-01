/**
 * Project-related React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryApi } from "@/api/query-client";
import { queryKeys } from "@/lib/react-query";

// Types
export interface Project {
  id: string;
  name: string;
  type: "Basic" | "Application";
  objective: string;
  description: string;
  status: "Draft" | "Under Review" | "Active" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt: string;
  pi: string;
  budget?: number;
  team?: TeamResearcher[];
  progress?: number;
  category?: string;
  manager?: string;
  year?: string;
}

export interface TeamResearcher {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface ProjectFilters {
  status?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

export interface CreateProjectData {
  name: string;
  type: "Basic" | "Application";
  objective: string;
  description: string;
  relatedProjects?: string;
  [key: string]: string | undefined;
}

export interface UpdateProjectData {
  name?: string;
  type?: "Basic" | "Application";
  objective?: string;
  description?: string;
  relatedProjects?: string;
  status?: Project["status"];
  budget?: number;
  progress?: number;
  [key: string]: string | number | undefined;
}

/**
 * Hook to fetch all projects with optional filters
 */
export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: () => queryApi.getPaginated<Project>("/projects", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single project by ID
 */
export const useProject = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => queryApi.get<Project>(`/projects/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

/**
 * Hook to fetch project milestones
 */
export const useProjectMilestones = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.projects.milestones(projectId),
    queryFn: () => queryApi.get(`/projects/${projectId}/milestones`),
    enabled: enabled && !!projectId,
    throwOnError: true,
  });
};

/**
 * Hook to fetch project tasks
 */
export const useProjectTasks = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.projects.tasks(projectId),
    queryFn: () => queryApi.get(`/projects/${projectId}/tasks`),
    enabled: enabled && !!projectId,
    throwOnError: true,
  });
};

/**
 * Hook to fetch project budget
 */
export const useProjectBudget = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.projects.budget(projectId),
    queryFn: () => queryApi.get(`/projects/${projectId}/budget`),
    enabled: enabled && !!projectId,
    throwOnError: true,
  });
};

/**
 * Hook to fetch project team
 */
export const useProjectTeam = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.projects.team(projectId),
    queryFn: () =>
      queryApi.get<TeamResearcher[]>(`/projects/${projectId}/team`),
    enabled: enabled && !!projectId,
    throwOnError: true,
  });
};

/**
 * Hook to create a new project
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) =>
      queryApi.post<Project>("/projects", data),
    onSuccess: (newProject) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });

      // Add the new project to cache
      queryClient.setQueryData(
        queryKeys.projects.detail(newProject.id),
        newProject
      );

      toast.success("Project created successfully!", {
        description: `${newProject.name} has been created and is now under review.`,
      });
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to update an existing project
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      queryApi.put<Project>(`/projects/${id}`, data),
    onSuccess: (updatedProject) => {
      // Update the project in cache
      queryClient.setQueryData(
        queryKeys.projects.detail(updatedProject.id),
        updatedProject
      );

      // Invalidate projects list to refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });

      toast.success("Project updated successfully!", {
        description: `${updatedProject.name} has been updated.`,
      });
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project");
    },
  });
};

/**
 * Hook to delete a project
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/projects/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove the project from cache
      queryClient.removeQueries({
        queryKey: queryKeys.projects.detail(deletedId),
      });

      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });

      toast.success("Project deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    },
  });
};

/**
 * Hook to add team RESEARCHER to project
 */
export const useAddTeamRESEARCHER = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      ResearcherId,
    }: {
      projectId: string;
      ResearcherId: string;
    }) => queryApi.post(`/projects/${projectId}/team`, { ResearcherId }),
    onSuccess: (_, variables) => {
      // Invalidate project team cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.team(variables.projectId),
      });

      toast.success("Team RESEARCHER added successfully!");
    },
    onError: (error) => {
      console.error("Failed to add team RESEARCHER:", error);
      toast.error("Failed to add team RESEARCHER");
    },
  });
};

/**
 * Hook to remove team RESEARCHER from project
 */
export const useRemoveTeamResearcher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      ResearcherId,
    }: {
      projectId: string;
      ResearcherId: string;
    }) => queryApi.delete(`/projects/${projectId}/team/${ResearcherId}`),
    onSuccess: (_, variables) => {
      // Invalidate project team cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.team(variables.projectId),
      });

      toast.success("Team RESEARCHER removed successfully!");
    },
    onError: (error) => {
      console.error("Failed to remove team RESEARCHER:", error);
      toast.error("Failed to remove team RESEARCHER");
    },
  });
};
