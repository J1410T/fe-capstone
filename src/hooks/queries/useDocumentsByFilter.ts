// hooks/useDocumentsByFilter.ts
import { useQuery } from "@tanstack/react-query";
import { getDocumentsByFilter } from "@/services/resources/document";

export function useDocumentsByFilter(
  type: string,
  isTemplate: boolean = true,
  pageIndex: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ["document", type, isTemplate, pageIndex, pageSize],
    queryFn: () => getDocumentsByFilter(type, isTemplate, pageIndex, pageSize),
    enabled: !!type,
  });
}
