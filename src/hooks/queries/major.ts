import { getMajorsByField, getProjectMajors } from "@/services/resources/major";
import { useQuery } from "@tanstack/react-query";

export function useMajorsByField(fieldId: string) {
  return useQuery({
    queryKey: ["major-list", fieldId],
    queryFn: () => getMajorsByField(fieldId),
    enabled: !!fieldId && fieldId !== "all",
  });
}

export function useProjectMajors(projectId: string) {
  return useQuery({
    queryKey: ["project-majors", projectId],
    queryFn: () => getProjectMajors(projectId),
    enabled: !!projectId,
  });
}
