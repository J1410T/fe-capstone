import { getTasksByMilestoneId } from "@/services/resources/task";
import { useQuery } from "@tanstack/react-query";

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
