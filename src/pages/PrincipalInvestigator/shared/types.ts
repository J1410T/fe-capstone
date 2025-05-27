// Shared types for Principal Investigator components

export interface PIUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Leader" | "Secretary" | "Normal";
  department?: string;
  position?: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  type: "Basic" | "Application";
  objective: string;
  description: string;
  relatedProjects?: string[];
  status:
    | "Draft"
    | "Submitted"
    | "Under Review"
    | "Approved"
    | "Rejected"
    | "Active"
    | "Completed";
  createdAt: string;
  updatedAt: string;
  pi: string;
  budget?: Budget;
  team?: PIUser[];
  milestones?: Milestone[];
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

export interface Milestone {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  tasks: Task[];
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: "To Do" | "In Progress" | "Completed" | "Overdue";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  evaluatedBy?: string;
  evaluation?: string;
}

export interface ProgressReport {
  id: string;
  formCode: "BM06";
  title: string;
  period: string;
  submittedAt: string;
  status: "Draft" | "Submitted" | "Processing" | "Approved" | "Rejected";
  feedback?: string;
  file?: string;
  approvedBy?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "Online" | "In-Person";
  link?: string;
  location?: string;
  agenda: string;
  documents?: string[];
  attendees: PIUser[];
  status: "Scheduled" | "Completed" | "Cancelled";
  reminderSent?: boolean;
}

export interface SummaryReport {
  id: string;
  formCode: "BM09";
  title: string;
  content: string;
  hasSeminar: boolean;
  seminarForm?: string; // BM08 if applicable
  submittedAt: string;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
  feedback?: string;
}

export interface AcceptanceStatus {
  projectId: string;
  status: "Pending" | "Under Review" | "Accepted" | "Rejected";
  councilForms: {
    BM10?: string;
    BM11?: string;
    BM12?: string;
  };
  contractSigned: boolean;
  contractDate?: string;
  feedback?: string;
}

export interface PaymentSchedule {
  projectType: "Basic" | "Application";
  schedule: PaymentPhase[];
  totalAmount: number;
  paidAmount: number;
}

export interface PaymentPhase {
  phase: number;
  percentage: number;
  amount: number;
  dueDate: string;
  status: "Pending" | "Paid" | "Overdue";
  paidDate?: string;
}

export interface FormData {
  [key: string]: string | number | boolean | Date | File | null | undefined;
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
}

// Time limits and role management
export interface TimeLimit {
  quarter: 1 | 2 | 3 | 4;
  allowedProjectTypes: ("Basic" | "Application")[];
  deadline: string;
  isActive: boolean;
}

export interface RolePermission {
  canCreateProject: boolean;
  canUpdateProject: boolean;
  canManageTeam: boolean;
  canSubmitReports: boolean;
  canSignContract: boolean;
}
