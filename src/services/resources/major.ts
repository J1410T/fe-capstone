import {
  MajorItem,
  ProjectMajorFilterResponse,
  MajorFilterRequest,
  MajorFilterResponse,
  CreateMajorRequest,
  CreateMajorResponse,
  UpdateMajorRequest,
  UpdateMajorResponse,
} from "@/types/major";
import { axiosClient, getAccessToken } from "../api";
import {
  CreateProjectMajorRequest,
  CreateProjectMajorResponse,
} from "@/types/project";

export const getMajorsByField = async (fieldId: string) => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get<MajorItem[]>(
      `/major/by-field/${fieldId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getMajorsByField error:", error);
    throw error;
  }
};

export const getMajorsWithPagination = async (
  request: MajorFilterRequest
): Promise<MajorFilterResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<MajorFilterResponse>(
      "/major/filter",
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getMajorsWithPagination error:", error);
    throw error;
  }
};

export const createMajor = async (
  data: CreateMajorRequest
): Promise<CreateMajorResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<CreateMajorResponse>("/major", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("createMajor error:", error);
    throw error;
  }
};

export const updateMajor = async (
  id: string,
  data: UpdateMajorRequest
): Promise<UpdateMajorResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.put<UpdateMajorResponse>(
      `/major/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("updateMajor error:", error);
    throw error;
  }
};

export const deleteMajor = async (id: string): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axiosClient.delete(`/major/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("deleteMajor error:", error);
    throw error;
  }
};

// Keep existing functions for backward compatibility
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
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("createProjectMajor error:", error);
    throw error;
  }
};

export const getProjectMajors = async (projectId: string) => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get<ProjectMajorFilterResponse>(
      `/project-major/filter?ProjectId=${projectId}&PageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getProjectMajors error:", error);
    throw error;
  }
};
