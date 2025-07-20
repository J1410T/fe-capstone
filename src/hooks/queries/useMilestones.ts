import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryApi } from "@/services/query-client";
import { toast } from "sonner";

// Task interface
export interface Task {
  id: string;
  code: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  deliveryDate: string | null;
  priority: string | null;
  progress: number;
  overdue: number;
  meetingUrl: string | null;
  note: string | null;
  status: string;
  milestoneId: string;
  creatorId: string;
}

// Creator interface
export interface Creator {
  id: string;
  code: string;
  groupName: string;
  isOfficial: boolean;
  expireDate: string | null;
  createdAt: string;
  status: string;
  accountId: string;
  roleId: string;
  projectId: string;
  appraisalCouncilId: string | null;
}

// Milestone interface
export interface Milestone {
  id: string;
  code: string;
  title: string;
  description: string | null;
  objective: string | null;
  cost: number;
  startDate: string | null;
  endDate: string | null;
  type: "normal" | "critical" | "review";
  createdAt: string;
  status: "created" | "in_progress" | "completed" | "cancelled";
  projectId: string;
  creatorId: string;
  project: {
    id: string;
    title: string;
    status: string;
  } | null;
  creator: Creator;
  evaluations: {
    id: string;
    score: number;
    feedback: string;
  }[];
  tasks: Task[];
}

// Create milestone data interface
export interface CreateMilestoneData {
  code: string;
  title: string;
  description?: string;
  objective?: string;
  cost?: number;
  startDate?: string;
  endDate?: string;
  type?: Milestone["type"];
  status?: Milestone["status"];
  projectId: string;
}

// Update milestone data interface
export interface UpdateMilestoneData {
  code?: string;
  title?: string;
  description?: string;
  objective?: string;
  cost?: number;
  startDate?: string;
  endDate?: string;
  type?: Milestone["type"];
  status?: Milestone["status"];
}

// Query keys
export const milestoneQueryKeys = {
  all: ["milestones"] as const,
  lists: () => [...milestoneQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, string | number | boolean | undefined>) => [...milestoneQueryKeys.lists(), { filters }] as const,
  details: () => [...milestoneQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...milestoneQueryKeys.details(), id] as const,
  byProject: (projectId: string) => [...milestoneQueryKeys.all, "by-project", projectId] as const,
};

/**
 * Hook to fetch all milestones
 */
export const useMilestones = (filters?: Record<string, string | number | boolean | undefined>) => {
  return useQuery({
    queryKey: milestoneQueryKeys.list(filters),
    queryFn: () => queryApi.get<Milestone[]>("/milestones", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single milestone by ID
 */
export const useMilestone = (id: string, enabled = true) => {
  return useQuery({
    queryKey: milestoneQueryKeys.detail(id),
    queryFn: () => queryApi.get<Milestone>(`/milestones/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

/**
 * Hook to fetch milestones by project
 */
export const useMilestonesByProject = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: milestoneQueryKeys.byProject(projectId),
    queryFn: () => queryApi.get<Milestone[]>(`/milestones/by-project/${projectId}`),
    enabled: enabled && !!projectId,
    throwOnError: true,
  });
};

/**
 * Hook to create a new milestone
 */
export const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMilestoneData) =>
      queryApi.post<Milestone, CreateMilestoneData>("/milestones", data),
    onSuccess: (newMilestone) => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.all });

      // Invalidate milestones by project
      queryClient.invalidateQueries({ 
        queryKey: milestoneQueryKeys.byProject(newMilestone.projectId) 
      });

      // Add the new milestone to cache
      queryClient.setQueryData(
        milestoneQueryKeys.detail(newMilestone.id),
        newMilestone
      );

      toast.success("Milestone created successfully!", {
        description: `${newMilestone.title} has been created.`,
      });
    },
    onError: (error) => {
      console.error("Failed to create milestone:", error);
      toast.error("Failed to create milestone", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to update a milestone
 */
export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMilestoneData }) =>
      queryApi.put<Milestone, UpdateMilestoneData>(`/milestones/${id}`, data),
    onSuccess: (updatedMilestone) => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.all });

      // Invalidate milestones by project
      queryClient.invalidateQueries({ 
        queryKey: milestoneQueryKeys.byProject(updatedMilestone.projectId) 
      });

      // Update the milestone in cache
      queryClient.setQueryData(
        milestoneQueryKeys.detail(updatedMilestone.id),
        updatedMilestone
      );

      toast.success("Milestone updated successfully!", {
        description: `${updatedMilestone.title} has been updated.`,
      });
    },
    onError: (error) => {
      console.error("Failed to update milestone:", error);
      toast.error("Failed to update milestone", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to delete a milestone
 */
export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/milestones/${id}`),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.all });

      // Remove the milestone from cache
      queryClient.removeQueries({ queryKey: milestoneQueryKeys.detail(deletedId) });

      toast.success("Milestone deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete milestone:", error);
      toast.error("Failed to delete milestone", {
        description: "Please try again",
      });
    },
  });
};
