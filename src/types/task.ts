import { User } from "@/contexts/AuthContext";
import { Member } from "./auth";

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

export type Milestone = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  objective: string | null;
  cost: number | 0;
  startDate: string | null;
  endDate: string | null;
  type: string;
  createdAt: string;
  status: string;
  projectId: string;
  creatorId: string;
  project: string | null;
  creator: Member | null;
  evaluations: Evaluation[] | null;
  // individualEvaluations: IndividualEvaluation[];
  tasks: ProjectTask[] | null;
};

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
  startDate: string;
  endDate: string;
  deliveryDate: string;
  priority: string;
  progress: number;
  overdue: number;
  meetingUrl: string;
  note: string;
  status: string;
  milestoneId: string;
  creatorId: string;
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
};

export type Evaluation = {
  id: string;
  code: string;
  title: string;
  totalRate: number;
  comment: string;
  phrase: string;
  type: string;
  createDate: string;
  status: string;
};

export type IndividualEvaluation = {
  id: string;
  totalRate: number;
  comment: string;
  submittedAt: string;
  isApproved: boolean;
  reviewerResult: boolean;
  isAIReport: boolean;
  status: string;
  evaluationStageId: string;
  reviewerId: string;
  projectId: string;
  milestoneId: string;
  evaluator?: string; // Evaluator name for display
  documentId?: string; // Associated document ID
};

export type EvaluationType =
  | "milestone"
  | "midterm"
  | "summary"
  | "final"
  | "proposal";

export type ProjectEvaluation = {
  id: string;
  title: string;
  type: EvaluationType;
  description?: string;
  projectId: string;
  milestoneId?: string;
  createdAt: string;
  dueDate?: string;
  status: "active" | "completed" | "cancelled" | "pending";
  stages: EvaluationStage[];
};

export type EvaluationStage = {
  id: string;
  title: string;
  description?: string;
  evaluationId: string;
  order: number;
  createdAt: string;
  status: "active" | "completed" | "cancelled";
  individualEvaluations: IndividualEvaluation[];
};

export type EvaluationSummary = {
  totalEvaluations: number;
  totalStages: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  averageScore?: number;
  overallStatus: "not_started" | "in_progress" | "completed";
  evaluationsByType: Record<EvaluationType, number>;
};
