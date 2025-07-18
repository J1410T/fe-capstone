import {
  CreateProjectRequest,
  ProjectFilterRequest,
  ProjectFilterResponse,
  ProjectItem,
  SortOption,
} from "@/types/project";
import { axiosClient, getAccessToken } from "../api";

export const getProjectListFilter = async (
  params?: Partial<ProjectFilterRequest>
) => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<ProjectFilterResponse>(
      `/project/filter`,
      params,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getProjectListFilter error:", error);
    throw error;
  }
};

export const buildFilterParams = (filters: {
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
}): ProjectFilterRequest => {
  const {
    searchTerm,
    selectedStatus,
    selectedField,
    selectedMajor,
    selectedCategory,
    selectedType,
    selectedSort,
    tags,
    currentPage,
    pageSize,
  } = filters;

  // Build sort parameters
  const getSortParams = (sort: SortOption) => {
    switch (sort) {
      case "latest":
        return { "sort-by": "createdat", desc: true };
      case "oldest":
        return { "sort-by": "createdat", desc: false };
      case "a-z":
        return { "sort-by": "englishtitle", desc: false };
      case "z-a":
        return { "sort-by": "englishtitle", desc: true };
      default:
        return { "sort-by": "createdat", desc: true };
    }
  };

  const sortParams = getSortParams(selectedSort);
  const params: ProjectFilterRequest = {
    ...sortParams,
    "page-index": currentPage,
    "page-size": pageSize,
  };

  // Only add non-"all" filters
  if (searchTerm.trim()) {
    params.title = searchTerm.trim();
  }

  if (selectedStatus !== "all") {
    params.status = selectedStatus;
  }

  if (selectedCategory !== "all") {
    params.category = selectedCategory;
  }

  if (selectedType !== "all") {
    params.type = selectedType;
  }

  if (selectedField !== "all") {
    params["field-id"] = selectedField;
  }

  if (selectedMajor !== "all") {
    params["major-id"] = selectedMajor;
  }

  if (tags.length > 0) {
    params["tag-names"] = tags;
  }

  return params;
};

export const createProject = async (
  data: CreateProjectRequest
): Promise<ProjectItem> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<ProjectItem>(`/project`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("createProject error:", error);
    throw error;
  }
};

export const getProjectDetail = async (projectId: string) => {
  const accessToken = getAccessToken();
  return await axiosClient.get<ProjectItem>(`/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
