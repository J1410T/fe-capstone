/**
 * Appraisal Council API services
 */

import { axiosClient, getAccessToken } from "../api";
import {
  AppraisalCouncilByProject,
  AppraisalCouncilListRequest,
  AppraisalCouncilListResponse,
  AssignCouncilToProjectRequest,
  CreateAppraisalCouncilRequest,
  UpdateAppraisalCouncilRequest,
} from "@/types/appraisal-council";
import { getUserRolesByAppraisalCouncil } from "./auth";

/**
 * Get list of appraisal councils with pagination and search
 */
export const getAppraisalCouncilList = async (
  request: AppraisalCouncilListRequest
): Promise<AppraisalCouncilListResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<AppraisalCouncilListResponse>(
      "/appraisal-council/list",
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
    console.error("getAppraisalCouncilList error:", error);
    throw error;
  }
};

/**
 * Create a new appraisal council
 */
export const createAppraisalCouncil = async (
  request: CreateAppraisalCouncilRequest
): Promise<string> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<string>("/appraisal-council", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    return res.data;
  } catch (error) {
    console.error("createAppraisalCouncil error:", error);
    throw error;
  }
};

/**
 * Update an existing appraisal council
 */
export const updateAppraisalCouncil = async (
  request: UpdateAppraisalCouncilRequest
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    await axiosClient.put("/appraisal-council", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });
  } catch (error) {
    console.error("updateAppraisalCouncil error:", error);
    throw error;
  }
};

/**
 * Delete an appraisal council
 */
export const deleteAppraisalCouncil = async (
  councilId: string
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    await axiosClient.delete(`/appraisal-council/${councilId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("deleteAppraisalCouncil error:", error);
    throw error;
  }
};

/**
 * Get list of appraisal councils with member information combined
 */
export const getAppraisalCouncilListWithMembers = async (
  request: AppraisalCouncilListRequest
): Promise<AppraisalCouncilListResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    // First get the councils list
    const councilsResponse = await getAppraisalCouncilList(request);

    // Then fetch members for each council
    const councilsWithMembers = await Promise.all(
      councilsResponse["data-list"].map(async (council) => {
        try {
          const membersResponse = await getUserRolesByAppraisalCouncil(
            council.id,
            1,
            100
          );
          return {
            ...council,
            member: membersResponse["data-list"] || [],
          };
        } catch (error) {
          console.error(
            `Failed to fetch members for council ${council.id}:`,
            error
          );
          return {
            ...council,
            member: [],
          };
        }
      })
    );

    return {
      ...councilsResponse,
      "data-list": councilsWithMembers,
    };
  } catch (error) {
    console.error("getAppraisalCouncilListWithMembers error:", error);
    throw error;
  }
};

export const getAppraisalCouncilByProjectId = async (
  projectId: string
): Promise<AppraisalCouncilByProject> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.get<AppraisalCouncilByProject>(
      `/appraisal-council/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("getAppraisalCouncilByProjectId error:", error);
    throw error;
  }
};

export const assignAppraisalCouncilToProject = async (
  request: AssignCouncilToProjectRequest
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    await axiosClient.post(
      `/appraisal-council/assign-council?sourceProjectId=${request.sourceProjectId}&appraisalCouncilId=${request.appraisalCouncilId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error("assignAppraisalCouncilToProject error:", error);
    throw error;
  }
};
