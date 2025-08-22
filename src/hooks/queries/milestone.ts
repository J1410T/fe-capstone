import {
  createMilestone,
  deleteMilestone,
  getMilestonesByProjectId,
  updateMilestone,
} from "@/services/resources/milestone";
import { UpdateMilestoneRequest } from "@/types/milestone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMilestonesByProjectId(projectId: string) {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getMilestonesByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestone,
    onSuccess: (data) => {
      // Cập nhật lại danh sách milestones
      queryClient.invalidateQueries({
        queryKey: ["milestones", data["project-id"]],
      });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMilestoneRequest }) =>
      updateMilestone(id, data),
    onSuccess: (data) => {
      // Cập nhật lại danh sách milestones
      queryClient.invalidateQueries({
        queryKey: ["milestones", data["project-id"]],
      });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) =>
      deleteMilestone(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", variables.projectId],
      });
    },
  });
}
