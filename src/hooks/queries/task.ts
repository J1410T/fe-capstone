import {
  createMemberTask,
  createTask,
  getTasksByMilestoneId,
} from "@/services/resources/task";
import { CreateMemberTaskRequest, CreateTaskRequest } from "@/types/auth";
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

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskRequest) => createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Member assigned to task successfully");
    },
    onError: (error) => {
      console.error("Create member task error:", error);
      toast.error("Failed to assign member to task");
    },
  });
}
