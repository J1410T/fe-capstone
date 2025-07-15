import { useQuery } from "@tanstack/react-query";
import {
  getProjectListFilter,
  buildFilterParams,
} from "@/services/resources/project";
import { SortOption } from "@/types/project";

export function useProjectListFilter(
  filters: {
    searchTerm: string;
    selectedStatus: string;
    selectedField: string;
    selectedMajor: string;
    selectedCategory: string;
    selectedType: string;
    selectedSort: SortOption;
    tags: string[];
    currentPage: number;
    pageSize: number;
  },
  enabled: boolean = true
) {
  const params = buildFilterParams(filters);

  return useQuery({
    queryKey: ["project-list-filter", params],
    queryFn: () => getProjectListFilter(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useFieldList() {
  return useQuery({
    queryKey: ["field-list"],
    queryFn: () => getProjectListFilter(), // Adjust this to your actual field list API
    select: (data) => data?.["data-list"] || [],
  });
}
