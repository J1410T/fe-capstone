import { ProjectTaskResponse } from "@/types/task";
import { axiosClient, getAccessToken } from "../api";

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
