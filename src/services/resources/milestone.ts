import { Milestone } from "@/types/task";
import { axiosClient, getAccessToken } from "../api";

export const getMilestonesByProjectId = async (projectId: string) => {
  const accessToken = getAccessToken();
  return await axiosClient.get<Milestone[]>(`/milestone/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
