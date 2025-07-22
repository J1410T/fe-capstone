import { MajorItem, ProjectMajorFilterResponse } from "@/types/major";
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

export const getProjectMajors = async (
  projectId: string
): Promise<ProjectMajorFilterResponse> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get<ProjectMajorFilterResponse>(
      `/project-major/filter?ProjectId=${projectId}&PageSize=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log("getProjectMajors response:", res.data);
    return res.data;
  } catch (error) {
    console.error("getProjectMajors error:", error);
    throw error;
  }
};
