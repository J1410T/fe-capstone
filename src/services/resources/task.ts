import { ProjectTaskResponse, MemberTaskResponse } from "@/types/task";
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

export const updateTask = async (
  taskId: string,
  taskData: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.put(`/task/${taskId}`, taskData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    return res.data;
  } catch (error) {
    console.error("updateTask error:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    await axiosClient.delete(`/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("deleteTask error:", error);
    throw error;
  }
};

export const updateTaskStatus = async (
  taskId: string,
  status: string
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    await axiosClient.post(
      `/task/change-status?status=${status}`,
      `"${taskId}"`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
  } catch (error) {
    console.error("updateTaskStatus error:", error);
    throw error;
  }
};

export const getMemberTasksByTaskId = async (
  taskId: string,
  pageIndex: number = 1,
  pageSize: number = 10
): Promise<MemberTaskResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.get<MemberTaskResponse>(
      `/member-task/filter?TaskId=${taskId}&PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("getMemberTasksByTaskId error:", error);
    throw error;
  }
};

export const deleteMemberTask = async (memberTaskId: string): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    await axiosClient.delete(`/member-task/${memberTaskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("deleteMemberTask error:", error);
    throw error;
  }
};

// Update task status for Kanban drag and drop
export const updateTaskStatusKanban = async (
  taskId: string,
  status: "ToDo" | "InProgress" | "Completed" | "Overdue"
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    // The API expects status values without spaces: ToDo, InProgress, Completed, Overdue
    // No mapping needed - pass the status directly as received from Kanban
    const apiStatus = status;

    // Log the status for debugging
    console.log(`API status: ${apiStatus}`);

    // No need to URL encode since there are no spaces
    const encodedStatus = apiStatus;

    await axiosClient.post(
      `/task/change-status?status=${encodedStatus}`,
      `"${taskId}"`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
  } catch (error) {
    console.error("updateTaskStatusKanban error:", error);
    throw error;
  }
};
