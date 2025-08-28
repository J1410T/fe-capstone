import {
  SystemStatsResponse,
  TransactionsResponse,
  MilestonesProgressResponse,
  CouncilsResponse,
  ProjectStatusResponse,
  UserRolesResponse,
  MajorDistributionResponse,
  DateRangeParams,
  TimeSeriesParams,
  TimeSeriesResponse,
} from "@/types/dashboard";
import { axiosClient, getAccessToken } from "../api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

export const getSystemStats = async (params?: DateRangeParams) => {
  const queryParams = new URLSearchParams();
  if (params?.from) queryParams.append("from", params.from);
  if (params?.to) queryParams.append("to", params.to);

  const url = `/dashboard/system-stats${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return await axiosClient.get<SystemStatsResponse>(url, {
    headers: getAuthHeaders(),
  });
};

export const getTransactions = async (params?: DateRangeParams) => {
  const queryParams = new URLSearchParams();
  if (params?.from) queryParams.append("from", params.from);
  if (params?.to) queryParams.append("to", params.to);

  const url = `/dashboard/transactions${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return await axiosClient.get<TransactionsResponse>(url, {
    headers: getAuthHeaders(),
  });
};

export const getMilestonesProgress = async () => {
  return await axiosClient.get<MilestonesProgressResponse>(
    "/dashboard/milestones/progress",
    {
      headers: getAuthHeaders(),
    }
  );
};

export const getCouncils = async () => {
  return await axiosClient.get<CouncilsResponse>("/dashboard/councils", {
    headers: getAuthHeaders(),
  });
};

export const getProjectStatus = async (params?: DateRangeParams) => {
  const queryParams = new URLSearchParams();
  if (params?.from) queryParams.append("from", params.from);
  if (params?.to) queryParams.append("to", params.to);

  const url = `/dashboard/projects/status${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return await axiosClient.get<ProjectStatusResponse>(url, {
    headers: getAuthHeaders(),
  });
};

export const getUserRoles = async () => {
  return await axiosClient.get<UserRolesResponse>("/dashboard/userroles/base", {
    headers: getAuthHeaders(),
  });
};

export const getMajorDistribution = async (params?: DateRangeParams) => {
  const queryParams = new URLSearchParams();
  if (params?.from) queryParams.append("from", params.from);
  if (params?.to) queryParams.append("to", params.to);

  const url = `/dashboard/majors/distribution${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return await axiosClient.get<MajorDistributionResponse>(url, {
    headers: getAuthHeaders(),
  });
};

export const getTimeSeries = async (params?: TimeSeriesParams) => {
  const queryParams = new URLSearchParams();
  if (params?.from) queryParams.append("from", params.from);
  if (params?.to) queryParams.append("to", params.to);
  if (params?.granularity)
    queryParams.append("granularity", params.granularity);

  const url = `/dashboard/timeseries${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return await axiosClient.get<TimeSeriesResponse>(url, {
    headers: getAuthHeaders(),
  });
};
