import { getMilestonesByProjectId } from "@/services/resources/milestone";
import { useQuery } from "@tanstack/react-query";

export function useMilestonesByProjectId(projectId: string) {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getMilestonesByProjectId(projectId),
    enabled: !!projectId,
  });
}
