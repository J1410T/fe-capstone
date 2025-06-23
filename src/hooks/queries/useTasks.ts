/**
 * Task-related React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryApi } from "@/api/query-client";
import { queryKeys } from "@/lib/react-query";
import { Task } from "@/types/task";

// Types
export interface TaskFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
  projectId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  assigneeId: string;
  projectId?: string;
  dueDate: string;
  [key: string]: string | undefined;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  priority?: "Low" | "Medium" | "High";
  assigneeId?: string;
  dueDate?: string;
  [key: string]: string | undefined;
}

/**
 * Hook to fetch all tasks with optional filters
 */
export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn: () => queryApi.getPaginated<Task>("/tasks", filters),
    throwOnError: true,
  });
};

/**
 * Hook to fetch a single task by ID
 */
export const useTask = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => queryApi.get<Task>(`/tasks/${id}`),
    enabled: enabled && !!id,
    throwOnError: true,
  });
};

/**
 * Hook to fetch tasks by project
 */
export const useTasksByProject = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.tasks.byProject(projectId),
    queryFn: () => queryApi.get<Task[]>(`/tasks/project/${projectId}`),
    enabled: enabled && !!projectId,
    throwOnError: true,
  });
};

/**
 * Hook to fetch tasks by assignee
 */
export const useTasksByAssignee = (assigneeId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.tasks.byAssignee(assigneeId),
    queryFn: () => queryApi.get<Task[]>(`/tasks/assignee/${assigneeId}`),
    enabled: enabled && !!assigneeId,
    throwOnError: true,
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => queryApi.post<Task>("/tasks", data),
    onSuccess: (newTask) => {
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });

      // If task belongs to a project, invalidate project tasks
      if (newTask.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.byProject(newTask.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.tasks(newTask.projectId),
        });
      }

      // Invalidate assignee tasks
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.byAssignee(newTask.assignee.id),
      });

      // Add the new task to cache
      queryClient.setQueryData(queryKeys.tasks.detail(newTask.id), newTask);

      toast.success("Task created successfully!", {
        description: `"${newTask.title}" has been created and assigned.`,
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task", {
        description: "Please check your input and try again",
      });
    },
  });
};

/**
 * Hook to update an existing task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      queryApi.put<Task>(`/tasks/${id}`, data),
    onSuccess: (updatedTask) => {
      // Update the task in cache
      queryClient.setQueryData(
        queryKeys.tasks.detail(updatedTask.id),
        updatedTask
      );

      // Invalidate tasks lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });

      // If task belongs to a project, invalidate project tasks
      if (updatedTask.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.byProject(updatedTask.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.tasks(updatedTask.projectId),
        });
      }

      // Invalidate assignee tasks
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.byAssignee(updatedTask.assignee.id),
      });

      toast.success("Task updated successfully!", {
        description: `"${updatedTask.title}" has been updated.`,
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queryApi.delete(`/tasks/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove the task from cache
      queryClient.removeQueries({
        queryKey: queryKeys.tasks.detail(deletedId),
      });

      // Invalidate tasks lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });

      toast.success("Task deleted successfully!");
    },
    onError: (error: unknown) => {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    },
  });
};

/**
 * Hook to assign task to user
 */
export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      assigneeId,
    }: {
      taskId: string;
      assigneeId: string;
    }) => queryApi.post<Task>(`/tasks/${taskId}/assign`, { assigneeId }),
    onSuccess: (updatedTask: Task, variables) => {
      // Update task in cache
      queryClient.setQueryData(
        queryKeys.tasks.detail(variables.taskId),
        updatedTask
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.byAssignee(variables.assigneeId),
      });

      toast.success("Task assigned successfully!");
    },
    onError: (error: unknown) => {
      console.error("Failed to assign task:", error);
      toast.error("Failed to assign task");
    },
  });
};

/**
 * Hook to update task status
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      queryApi.patch<Task>(`/tasks/${taskId}/status`, { status }),
    onSuccess: (updatedTask) => {
      // Update task in cache
      queryClient.setQueryData(
        queryKeys.tasks.detail(updatedTask.id),
        updatedTask
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });

      if (updatedTask.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.byProject(updatedTask.projectId),
        });
      }

      toast.success("Task status updated!", {
        description: `"${updatedTask.title}" status changed to ${status}.`,
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    },
  });
};
