import { User } from "@/contexts/AuthContext";

export type TaskStatus = "To Do" | "In Progress" | "Completed" | "Overdue";
export type UserTaskStatus =
  | "Not Started"
  | "In Progress"
  | "Complete"
  | "Overdue";
export type KanbanStatus = "To Do" | "In Progress" | "Completed" | "Overdue";
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
}

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
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  status?: TaskStatus;
}
