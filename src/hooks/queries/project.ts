import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectListFilter,
  buildFilterParams,
  getProjectDetail,
  getMyProjectList,
  createProject,
  createProjectMajor,
  createProjectTag,
  updateProject,
  enrollProjectAsPrincipal,
} from "@/services/resources/project";
import {
  CreateProjectMajorRequest,
  CreateProjectRequest,
  CreateProjectTagRequest,
  UpdateProjectRequest,
  SortOption,
} from "@/types/project";

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

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectDetail(projectId),
    enabled: !!projectId,
  });
}

export function useMyProject() {
  return useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjectList,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-list-filter"] });
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
}

export function useCreateProjectMajor() {
  return useMutation({
    mutationFn: (data: CreateProjectMajorRequest) => createProjectMajor(data),
  });
}

export function useCreateProjectTag() {
  return useMutation({
    mutationFn: (data: CreateProjectTagRequest) => createProjectTag(data),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
      status,
    }: {
      projectId: string;
      data: UpdateProjectRequest;
      status?: string;
    }) => updateProject(projectId, data, status),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries after successful update
      // Use the projectId from variables if data structure is unexpected
      const projectId = data?.["project-detail"]?.id || variables.projectId;

      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project", projectId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["project-list-filter"] });
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
}

export function useEnrollProjectAsPrincipal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => enrollProjectAsPrincipal(projectId),
    onSuccess: (data) => {
      // Invalidate relevant queries after successful enrollment
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
      queryClient.invalidateQueries({ queryKey: ["project-list-filter"] });
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
}
