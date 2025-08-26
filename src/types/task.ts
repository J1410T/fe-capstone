import { User } from "@/contexts/AuthContext";
import { EvaluationStage, IndividualEvaluation } from "./evaluation";

// Re-export evaluation types for backward compatibility
export type { EvaluationStage, IndividualEvaluation };

export type TaskStatus = "ToDo" | "InProgress" | "Completed" | "Overdue";
export type UserTaskStatus =
  | "Not Started"
  | "In Progress"
  | "Complete"
  | "Overdue";
export type KanbanStatus = "ToDo" | "InProgress" | "Completed" | "Overdue";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: User;
  createdAt: string;
  dueDate: string;
  updatedAt: string;
  projectId?: string;
  "member-tasks"?: Array<{
    id: string;
    "member-id": string;
    member?: {
      id: string;
      name: string;
      avatarUrl: string;
    };
    progress?: number;
    overdue?: number;
    status?: string;
    note?: string;
  }>;
}

export type MemberTaskFilterRequest = {
  "task-id": string;
  "page-index": number;
  "page-size": number;
};

export interface TaskFilters {
  status?: TaskStatus | "All";
  search?: string;
  dateFilter?: "createdAt" | "dueDate";
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TaskStats {
  toDo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  total: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  projectId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: "ToDo" | "InProgress" | "Completed" | "Overdue";
  milestoneId?: string;
  memberTasks?: unknown;
  [key: string]: unknown; // optional for flexibility
}

export type ProjectTaskResponse = {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": ProjectTask[];
};

export type ProjectTask = {
  id: string;
  code: string;
  name: string;
  description: string;
  "start-date": string;
  "end-date": string;
  "delivery-date": string | null;
  priority: string;
  progress: number;
  overdue: number;
  "meeting-url": string | null;
  note: string;
  status: string;
  "milestone-id": string;
  "creator-id": string;
  "member-tasks": MemberTask[] | null;
};

export type MemberTask = {
  id: string;
  progress: number;
  overdue: number;
  note: string;
  deliveryDate: string;
  joinedAt: string;
  status: string;
  memberId: string;
  taskId: string;
  // Additional fields returned when member-tasks are included in task response
  "full-name"?: string;
  "avatar-url"?: string | null;
  "role-name"?: string;
};

// Response type for getting member tasks by task ID
export type MemberTaskResponse = {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": MemberTask[];
};

// New types for task management operations
export interface UpdateTaskRequest {
  name: string;
  description: string;
  "start-date": string;
  "end-date": string;
  priority: string;
  progress: number;
  overdue: number;
  "meeting-url": string | null;
  note: string;
  "milestone-id": string;
  "member-tasks": MemberTask[] | null;
}

export interface UpdateTaskStatusRequest {
  taskId: string;
  status: string;
}

export interface DeleteMemberTaskRequest {
  memberTaskId: string;
}
