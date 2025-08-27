import {
  createMemberTask,
  createTask,
  getTasksByMilestoneId,
  updateTask,
  deleteTask,
  updateTaskStatus,
  deleteMemberTask,
  getMemberTasksByTaskId,
  updateTaskStatusKanban,
  getAllMeetingTaskByCouncil,
} from "@/services/resources/task";
import { CreateMemberTaskRequest, CreateTaskRequest } from "@/types/auth";
import { UpdateTaskRequest } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTasksByMilestoneId(
  milestoneId: string,
  pageIndex: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ["tasks", milestoneId, pageIndex, pageSize],
    queryFn: () => getTasksByMilestoneId(milestoneId, pageIndex, pageSize),
    enabled: !!milestoneId,
  });
}

export function useMemberTasksByTaskId(
  taskId: string,
  pageIndex: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ["member-tasks", taskId, pageIndex, pageSize],
    queryFn: () => getMemberTasksByTaskId(taskId, pageIndex, pageSize),
    enabled: !!taskId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskRequest) => createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks-with-members"] });
      queryClient.invalidateQueries({
        queryKey: ["project-list-with-meeting-task"],
      });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      console.error("Create task error:", error);
      toast.error("Failed to create task");
    },
  });
}

export function useCreateMemberTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberTaskData: CreateMemberTaskRequest) =>
      createMemberTask(memberTaskData),
    onSuccess: () => {
      // Invalidate and refetch all task-related queries for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["member-tasks"] });
      toast.success("Member assigned to task successfully");
    },
    onError: (error) => {
      console.error("Create member task error:", error);
      toast.error("Failed to assign member to task");
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      taskData,
    }: {
      taskId: string;
      taskData: Partial<UpdateTaskRequest>;
    }) => updateTask(taskId, taskData),

    onSuccess: () => {
      console.log(
        "🔄 Query invalidation - Starting invalidation after task update"
      );

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["member-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks-with-members"] });
      queryClient.invalidateQueries({
        queryKey: ["project-list-with-meeting-task"],
      });

      console.log(
        "✅ Query invalidation - All task-related queries invalidated"
      );
      toast.success("Task updated successfully!");
    },

    onError: (error) => {
      console.error("❌ Failed to update task:", error);
      toast.error("Failed to update task");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      // Invalidate all task-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["member-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks-with-members"] });
      queryClient.invalidateQueries({
        queryKey: ["project-list-with-meeting-task"],
      });
      // Don't show toast here - let the calling component handle it
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
      // Don't show toast here - let the calling component handle it with more specific error messages
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    },
  });
}

export function useDeleteMemberTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberTaskId: string) => deleteMemberTask(memberTaskId),
    onSuccess: () => {
      // Invalidate and refetch all task-related queries for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["member-tasks"] });
      // Don't show toast here - let the calling component handle it
    },
    onError: (error) => {
      console.error("Failed to delete member task:", error);
      // Don't show toast here - let the calling component handle it with more specific error messages
    },
  });
}

export function useUpdateTaskStatusKanban() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: "ToDo" | "InProgress" | "Completed" | "Overdue";
    }) => updateTaskStatusKanban(taskId, status),
    onSuccess: (_, variables) => {
      // Invalidate all task-related queries to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Show success message only for manual status changes (not overdue auto-updates)
      if (variables.status !== "Overdue") {
        toast.success("Task status updated successfully!");
      }
    },
    onError: (error, variables) => {
      console.error("Failed to update task status:", error);

      // Show error message only for manual status changes
      if (variables.status !== "Overdue") {
        toast.error("Failed to update task status");
      }
    },
  });
}

export function useAllMeetingTaskByCouncil() {
  return useQuery({
    queryKey: ["all-meeting-task-by-council"],
    queryFn: () => getAllMeetingTaskByCouncil(),
  });
}
