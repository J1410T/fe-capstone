import { useQuery } from "@tanstack/react-query";
import { DateRangeParams } from "@/types/dashboard";
import {
  getCouncils,
  getMajorDistribution,
  getMilestonesProgress,
  getProjectStatus,
  getSystemStats,
  getTransactions,
  getUserRoles,
} from "@/services/resources/dashboard";

export const useDashboardSystemStats = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["dashboard", "system-stats", params?.from, params?.to],
    queryFn: () => getSystemStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardTransactions = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["dashboard", "transactions", params?.from, params?.to],
    queryFn: () => getTransactions(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardMilestonesProgress = () => {
  return useQuery({
    queryKey: ["dashboard", "milestones-progress"],
    queryFn: getMilestonesProgress,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardCouncils = () => {
  return useQuery({
    queryKey: ["dashboard", "councils"],
    queryFn: getCouncils,
    staleTime: 10 * 60 * 1000, // 10 minutes (less frequently changing)
  });
};

export const useDashboardProjectStatus = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["dashboard", "project-status", params?.from, params?.to],
    queryFn: () => getProjectStatus(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardUserRoles = () => {
  return useQuery({
    queryKey: ["dashboard", "user-roles"],
    queryFn: getUserRoles,
    staleTime: 10 * 60 * 1000,
  });
};

export const useDashboardMajorDistribution = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ["dashboard", "major-distribution", params?.from, params?.to],
    queryFn: () => getMajorDistribution(params),
    staleTime: 5 * 60 * 1000,
  });
};
