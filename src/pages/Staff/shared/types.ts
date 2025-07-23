// Shared types and interfaces for Staff module components

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User Management Types
export interface StaffUser extends BaseEntity {
  name: string;
  email: string;
  role: "Staff" | "Admin" | "Super Admin";
  department: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin?: string;
  permissions: string[];
}

// Field Management Types
export interface Field extends BaseEntity {
  name: string;
  description: string;
  status: "Active" | "Inactive";
  majorCount: number;
}

// Major Management Types
export interface Major extends BaseEntity {
  name: string;
  fieldId: string;
  field: Field;
  status: "Active" | "Inactive";
  studentCount: number;
}

// Council Management Types
export interface Council extends BaseEntity {
  name: string;
  type: "Technical" | "Environmental" | "Medical" | "Business" | "Academic";
  description: string;
  status: "Active" | "Inactive";
  memberCount: number;
  chairperson?: string;
}

// Transaction Types
export interface Transaction extends BaseEntity {
  projectId: string;
  projectTitle: string;
  pi: string;
  amount: number;
  type: "Payment" | "Refund" | "Adjustment";
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  description: string;
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  notes?: string;
}

// Appraisal Council Types
export interface AppraisalCouncil extends BaseEntity {
  name: string;
  description: string;
  status: "Active" | "Inactive" | "Suspended";
  chairperson: string;
  members: CouncilMember[];
  projectsAssigned: number;
}

export interface CouncilMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "Chairman" | "Member" | "Secretary";
  joinedAt: string;
}

// Meeting Types (extending from existing StaffMeetings)
export interface StaffMeeting extends BaseEntity {
  title: string;
  projectName: string;
  projectId: string;
  milestone: string;
  milestoneId: string;
  council: string;
  date: string;
  time: string;
  meetingLink: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  type:
    | "Milestone Review"
    | "Proposal Evaluation"
    | "Final Review"
    | "Progress Review";
  attendees: number;
  createdBy: string;
}

// Form Data Types
export interface MeetingFormData {
  title: string;
  projectId: string;
  milestoneId: string;
  council: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  meetingLink: string;
  notes: string;
}

export interface BulkMeetingData {
  projectId: string;
  projectName: string;
  council: string;
  meetingLinkTemplate: string;
  milestones: Array<{
    milestoneId: string;
    milestoneName: string;
    date: Date | undefined;
    startTime: string;
    endTime: string;
  }>;
}

// Table Configuration Types
export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

export interface TableConfig<T = unknown> {
  columns: TableColumn<T>[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  actions?: Array<{
    label: string;
    icon?: React.ComponentType;
    onClick: (row: T) => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    className?: string;
  }>;
}

// Form Configuration Types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea" | "date" | "number";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: unknown) => string | undefined;
  className?: string;
}

export interface FormConfig {
  fields: FormField[];
  title: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

// Filter and Search Types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchConfig {
  placeholder: string;
  fields: string[]; // Fields to search in
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  type: "select" | "multiselect" | "date" | "range";
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Common Status Types
export type Status =
  | "Active"
  | "Inactive"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed"
  | "Cancelled";

// Action Types for CRUD operations
export type ActionType =
  | "create"
  | "edit"
  | "view"
  | "delete"
  | "activate"
  | "deactivate";

// Permission Types
export interface Permission {
  resource: string;
  actions: ActionType[];
}

// Audit Log Types
export interface AuditLog extends BaseEntity {
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
