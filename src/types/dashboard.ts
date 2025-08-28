// Dashboard API Types
export interface SystemStatsResponse {
  "total-projects-created": number;
  "completed-projects": number;
  "active-projects": number;
  "active-users": number;
  "total-evaluations": number;
  "total-milestones": number;
}

export interface TransactionsResponse {
  "total-transactions": number;
  "total-money": number;
  "pending-transactions": number;
  "average-monthly": number;
  "processing-rate": string;
}

export interface MilestonesProgressResponse {
  "total-milestones": number;
  "completed-milestones": number;
  "in-progress-milestones": number;
  "cancelled-milestones": number;
  "completion-rate": string;
}

export interface CouncilsResponse {
  "total-fields": number;
  "total-majors": number;
  "total-council-members": number;
  "average-projects-per-council": number;
}

export interface ProjectStatusResponse {
  "in-progress": number;
  created: number;
  cancelled: number;
  completed: number;
}

export interface UserRoleItem {
  "role-name": string;
  "user-count": number;
}

export type UserRolesResponse = UserRoleItem[];

export interface MajorDistributionItem {
  "major-name": string;
  "project-count": number;
}

export type MajorDistributionResponse = MajorDistributionItem[];

export interface DateRangeParams {
  from?: string | null;
  to?: string | null;
}

export interface TimeSeriesDataPoint {
  projects: number;
  evaluations: number;
  milestones: number;
  users: number;
  transactions: number;
}

export interface TimeSeriesResponse {
  [date: string]: TimeSeriesDataPoint;
}

export interface TimeSeriesParams extends DateRangeParams {
  granularity?: "daily" | "weekly" | "monthly";
}
