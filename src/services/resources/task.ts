import { ProjectTaskResponse } from "@/types/task";
import { axiosClient, getAccessToken } from "../api";
import {
  CreateMemberTaskRequest,
  CreateMemberTaskResponse,
  CreateTaskRequest,
  CreateTaskResponse,
} from "@/types/auth";

export const getTasksByMilestoneId = async (
  milestoneId: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  const accessToken = getAccessToken();
  return await axiosClient.get<ProjectTaskResponse>(
    `/task/filter?MilestoneId=${milestoneId}&PageIndex=${pageIndex}&PageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const createTask = async (
  taskData: CreateTaskRequest
): Promise<CreateTaskResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<CreateTaskResponse>("/task", taskData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    return res.data;
  } catch (error) {
    console.error("createTask error:", error);
    throw error;
  }
};

export const createMemberTask = async (
  memberTaskData: CreateMemberTaskRequest
): Promise<CreateMemberTaskResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<CreateMemberTaskResponse>(
      "/member-task",
      memberTaskData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("createMemberTask error:", error);
    throw error;
  }
};
