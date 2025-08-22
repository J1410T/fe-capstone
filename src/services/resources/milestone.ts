import {
  CreateMilestoneRequest,
  Milestone,
  UpdateMilestoneRequest,
} from "@/types/milestone";
import { axiosClient, getAccessToken } from "../api";

export const getMilestonesByProjectId = async (projectId: string) => {
  const accessToken = getAccessToken();
  return await axiosClient.get<Milestone[]>(`/milestone/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createMilestone = async (data: CreateMilestoneRequest) => {
  const accessToken = getAccessToken();
  const response = await axiosClient.post<Milestone>("/milestone", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// UPDATE milestone
export const updateMilestone = async (
  id: string,
  data: UpdateMilestoneRequest
) => {
  const accessToken = getAccessToken();
  const response = await axiosClient.put<Milestone>(`/milestone/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// DELETE milestone
export const deleteMilestone = async (id: string) => {
  const accessToken = getAccessToken();
  await axiosClient.delete(`/milestone/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
