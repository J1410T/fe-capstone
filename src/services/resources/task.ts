import {
  ProjectTaskResponse,
  MemberTaskResponse,
  MemberTaskFilterRequest,
  UpdateTaskRequest,
  ProjectTask,
} from "@/types/task";
import { axiosClient, getAccessToken } from "../api";
import {
  CreateMemberTaskRequest,
  CreateMemberTaskResponse,
  CreateTaskRequest,
  CreateTaskResponse,
} from "@/types/auth";
import { AppraisalCouncilListResponse } from "@/types/appraisal-council";
import { getMyAppraisalCouncils } from "./appraisal-council";
import { getProjectsByCouncilIdWithProposal } from "./project";
import { getMilestonesByProjectId } from "./milestone";
import { Milestone } from "@/types/milestone";
import { ProjectWithProposals } from "@/types/project";

export const getTasksByMilestoneId = async (
  milestoneId: string,
  pageIndex: number = 1,
  pageSize: number = 100
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
  taskData: Partial<UpdateTaskRequest> // partial để chấp nhận chỉ truyền các trường cần update
): Promise<UpdateTaskRequest> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("No token");

  // Get current task data from server
  const currentRes = await axiosClient.get<UpdateTaskRequest>(
    `/task/${taskId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const currentTask = currentRes.data;
  console.log("🔍 updateTask - Current task from server:", currentTask);
  console.log(
    "🔍 updateTask - Current member-tasks:",
    currentTask["member-tasks"]
  );

  // Merge dữ liệu update vào currentTask
  const mergedTaskData: UpdateTaskRequest = {
    ...currentTask,
    ...taskData,
    "member-tasks": currentTask["member-tasks"] ?? [], // giữ nguyên hoặc array rỗng nếu không có
  };
  console.log("🔍 updateTask - Incoming task data:", taskData);
  console.log(
    "🔍 updateTask - Merged task data being sent to API:",
    mergedTaskData
  );

  const res = await axiosClient.put<UpdateTaskRequest>(
    `/task/${taskId}`,
    mergedTaskData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    console.log("🗑️ API - Deleting task:", taskId);

    const response = await axiosClient.delete(`/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("✅ API - Task deleted successfully:", taskId, response.status);
  } catch (error: unknown) {
    const axiosError = error as {
      response?: {
        data?: { message?: string };
        status?: number;
        statusText?: string;
      };
      message?: string;
    };
    // Enhance error message with more context
    if (axiosError.response?.status === 500) {
      throw new Error(
        `Server error (500): Unable to delete task ${taskId}. ${
          axiosError.response?.data?.message || "Internal server error"
        }`
      );
    } else if (axiosError.response?.status === 404) {
      throw new Error(
        `Task not found (404): Task ${taskId} does not exist or has already been deleted.`
      );
    } else if (axiosError.response?.status === 403) {
      throw new Error(
        `Permission denied (403): You don't have permission to delete task ${taskId}.`
      );
    } else if (axiosError.response?.status === 409) {
      throw new Error(
        `Conflict (409): Task ${taskId} cannot be deleted due to dependencies. Please remove associated member tasks first.`
      );
    }

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

    const requestBody: MemberTaskFilterRequest = {
      "task-id": taskId,
      "page-index": pageIndex,
      "page-size": pageSize,
    };

    const res = await axiosClient.post<MemberTaskResponse>(
      "/member-task/filter",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return res.data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: {
        data?: { message?: string };
        status?: number;
        statusText?: string;
      };
      message?: string;
    };

    // Handle 404 specifically - this might mean no member tasks exist
    if (axiosError.response?.status === 404) {
      console.warn(
        `⚠️ Member task endpoint not found for task ${taskId} - returning empty result`
      );
      // Return empty result instead of throwing error
      return {
        "data-list": [],
        "total-count": 0,
        "total-page": 0,
        "page-index": pageIndex,
        "page-size": pageSize,
      } as MemberTaskResponse;
    }

    throw error;
  }
};

export const deleteMemberTask = async (memberTaskId: string): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await axiosClient.delete(`/member-task/${memberTaskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(
      "✅ API - Member task deleted successfully:",
      memberTaskId,
      response.status
    );
  } catch (error: unknown) {
    const axiosError = error as {
      response?: {
        data?: { message?: string };
        status?: number;
        statusText?: string;
      };
      message?: string;
    };

    // Enhance error message with more context
    if (axiosError.response?.status === 500) {
      throw new Error(
        `Server error (500): Unable to delete member task ${memberTaskId}. ${
          axiosError.response?.data?.message || "Internal server error"
        }`
      );
    } else if (axiosError.response?.status === 404) {
      throw new Error(
        `Member task not found (404): Member task ${memberTaskId} does not exist or has already been deleted.`
      );
    } else if (axiosError.response?.status === 403) {
      throw new Error(
        `Permission denied (403): You don't have permission to delete member task ${memberTaskId}.`
      );
    }

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

export const getAllMeetingTaskByCouncil = async (
  pageIndex: number = 1,
  pageSize: number = 10
): Promise<AppraisalCouncilListResponse> => {
  try {
    // 1. Lấy danh sách council
    const councils = await getMyAppraisalCouncils({
      "page-index": pageIndex,
      "page-size": pageSize,
    });

    // 2. Duyệt council
    const councilWithProjects = await Promise.all(
      councils["data-list"].map(async (council) => {
        // 2.1 Lấy projects - include more statuses to show more data
        const projects = await getProjectsByCouncilIdWithProposal(
          council.id,
          true,
          ["inprogress", "created", "approved"]
        ).catch(() => [] as ProjectWithProposals[]); // fallback nếu lỗi

        // 2.2 Duyệt projects
        const projectsWithTasks = await Promise.all(
          projects.map(async (project) => {
            // 2.2.1 Lấy milestones
            const milestonesRes = await getMilestonesByProjectId(
              project.id
            ).catch(() => ({ data: [] as Milestone[] }));

            const milestones = milestonesRes.data ?? [];

            // 2.2.2 Tìm milestone = 'meeting'
            const meetingMilestone = milestones.find(
              (m) => m.title?.trim().toLowerCase() === "meeting"
            );

            if (!meetingMilestone) {
              return { ...project, milestoneId: undefined, tasks: [] };
            }

            // 2.2.3 Lấy tasks
            const taskRes = await getTasksByMilestoneId(
              meetingMilestone.id
            ).catch(() => ({ data: { "data-list": [] as ProjectTask[] } }));

            return {
              ...project,
              milestoneId: meetingMilestone.id,
              tasks: taskRes.data["data-list"],
            };
          })
        );

        return { ...council, proposal: projectsWithTasks };
      })
    );

    // 3. Return kết quả cuối
    return { ...councils, "data-list": councilWithProjects };
  } catch (error) {
    console.error("getAllMeetingTaskByCouncil error:", error);
    throw error;
  }
};
