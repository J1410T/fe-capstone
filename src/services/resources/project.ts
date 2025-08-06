import {
  CreateProjectMajorRequest,
  CreateProjectMajorResponse,
  CreateProjectRequest,
  CreateProjectTagRequest,
  UpdateProjectRequest,
  EnrollProjectResponse,
  MyProjectResponse,
  ProjectDetailResponse,
  ProjectFilterRequest,
  ProjectFilterResponse,
  // ProjectItem,
  ProjectTag,
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
        return { "sort-by": "createdate", desc: true };
      case "oldest":
        return { "sort-by": "createdate", desc: false };
      case "a-z":
        return { "sort-by": "englishtitle", desc: false };
      case "z-a":
        return { "sort-by": "englishtitle", desc: true };
      default:
        return { "sort-by": "createdate", desc: true };
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
): Promise<string> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<string>(`/project`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("createProject error:", error);
    throw error;
  }
};

export const createProjectMajor = async (
  data: CreateProjectMajorRequest
): Promise<CreateProjectMajorResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<CreateProjectMajorResponse>(
      `/project-major`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("createProjectMajor error:", error);
    throw error;
  }
};

export const createProjectTag = async (
  data: CreateProjectTagRequest
): Promise<ProjectTag[]> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<ProjectTag[]>(`/project-tag`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("createProjectTag error:", error);
    throw error;
  }
};

export const getProjectDetail = async (projectId: string) => {
  const accessToken = getAccessToken();
  return await axiosClient.get<ProjectDetailResponse>(`/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getMyProjectList = async () => {
  const accessToken = getAccessToken();
  return await axiosClient.get<MyProjectResponse[]>(`/project/my-project`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateProject = async (
  projectId: string,
  data: UpdateProjectRequest,
  status?: string
): Promise<ProjectDetailResponse> => {
  try {
    const accessToken = getAccessToken();
    const url = status
      ? `/project/${projectId}?status=${status}`
      : `/project/${projectId}`;
    const res = await axiosClient.put<ProjectDetailResponse>(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("updateProject error:", error);
    throw error;
  }
};

export const enrollProjectAsPrincipal = async (
  projectId: string
): Promise<EnrollProjectResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<EnrollProjectResponse>(
      `/project/enroll-as-principal/${projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("enrollProjectAsPrincipal error:", error);
    throw error;
  }
};
