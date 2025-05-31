// Shared types for ProjectDetailPage components

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Member" | "Leader" | "Secretary";
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
  pi: string;
  department: string;
  year: string;
  status: string;
  progress: number;
  budget: Budget;
  team: TeamMember[];
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

export type MemberRole =
  | "Member"
  | "Leader"
  | "Secretary"
  | "Principal Investigator";

export interface AddMemberFormData {
  email: string;
  role: MemberRole;
}

export interface RoleChangeConfirmation {
  currentMember?: TeamMember;
  newRole: MemberRole;
  targetMember: TeamMember;
}
