// Shared types for ProjectDetailPage components

export interface TeamResearcher {
  id: string;
  name: string;
  email: string;
  role: "Researcher" | "Leader" | "Secretary";
  department: string;
  avatar?: string;
  joinedAt: string;
}

export interface Budget {
  total: number;
  spent: number;
  allocated: {
    personnel: number;
    equipment: number;
    travel: number;
    materials: number;
    other: number;
  };
  expenses: Expense[];
}

export interface Expense {
  id: string;
  category: "personnel" | "equipment" | "travel" | "materials" | "other";
  description: string;
  amount: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  receipt?: string;
  approvedBy?: string;
  feedback?: string;
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  principalInvestigatorId?: string;
  principalInvestigator?: {
    id: string;
    name: string;
    email: string;
  };
  milestones: Milestone[];
  team: TeamResearcher[];
  year: string;
  progress: number;
  budget: Budget;
  objectives: string[];
  timeline: {
    start: string;
    end: string;
    milestones: Array<{
      name: string;
      date: string;
      status: string;
    }>;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: string;
    dueDate: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    uploadedBy: string;
  }>;
  reports: Array<{
    name: string;
    date: string;
    status: string;
  }>;
}

export interface ProjectMembership {
  projectId: string;
  userId: string;
  role: "Principal" | "Researcher";
  joinedAt: string;
}

export interface EnrollProjectData {
  projectId: string;
  role: "Principal" | "Researcher";
  message?: string;
}

export type ResearcherRole =
  | "Researcher"
  | "Leader"
  | "Secretary"
  | "Principal Investigator";

export interface AddResearcherFormData {
  email: string;
  role: ResearcherRole;
}

export interface RoleChangeConfirmation {
  currentResearcher?: TeamResearcher;
  newRole: ResearcherRole;
  targetResearcher: TeamResearcher;
}

// Milestone and Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  evaluatedBy?: string;
  evaluation?: string;
  "start-date": string;
  "end-date": string;
  "member-tasks": string;
}

export interface MemberTask {
  id: string;
  name: string;
  progress: number;
  overdue: number;
  note: string;
  deliveryDate: string;
  joinedAt: string;
  status: string;
  memberId: string;
  taskId: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  progress: number;
  "start-date": string;
  "end-date": string;
  tasks: Task[];
}

// Progress Report types
export interface ProgressReport {
  id: string;
  formCode?: string;
  title: string;
  description?: string;
  period?: string;
  submittedAt: string;
  submittedBy?: string;
  status:
    | "Draft"
    | "Submitted"
    | "Under Review"
    | "Approved"
    | "Rejected"
    | "Processing";
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  file?: string;
  attachments?: FileUpload[];
}

// PI User type for team management
export interface PIUser {
  id: string;
  name: string;
  email: string;
  role: "Normal" | "Secretary" | "Leader";
  joinedAt: string;
  avatar?: string;
}
