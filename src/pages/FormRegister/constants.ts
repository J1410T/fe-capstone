import { UserRole } from "@/contexts/AuthContext";

// Form statuses for workflow management
export enum FormStatus {
  DRAFT = "Draft",
  WAITING_FOR_PI = "Waiting for PI",
  WAITING_FOR_STAFF = "Waiting for Staff",
  FINALIZED = "Finalized",
  VIEW_ONLY = "View Only",
  SUBMITTED = "Submitted",
}

// Form workflow rules
export interface FormWorkflowRule {
  canEdit: (
    status: FormStatus,
    userRole: UserRole,
    lastUpdatedBy: UserRole
  ) => boolean;
  canView: (status: FormStatus, userRole: UserRole) => boolean;
  nextStatus: (currentStatus: FormStatus, userRole: UserRole) => FormStatus;
}

// Form metadata interface
export interface FormMetadata {
  id: string;
  formType: FormType;
  title: string;
  projectId?: string;
  projectTitle?: string;
  status: FormStatus;
  submissionDate?: string;
  lastUpdated: string;
  lastUpdatedBy: UserRole;
  lastUpdatedByName: string;
  createdBy: UserRole;
  createdByName: string;
  content?: string;
  editHistory?: FormEditHistory[];
}

// Form edit history
export interface FormEditHistory {
  id: string;
  timestamp: string;
  updatedBy: UserRole;
  updatedByName: string;
  action: "created" | "updated" | "submitted" | "finalized";
  changes?: string;
}

// Form types and their role-based visibility
export const FORM_TYPES: Record<
  string,
  { id: string; title: string; roles: UserRole[]; workflow: FormWorkflowRule }
> = {
  BM1: {
    id: "BM1",
    title: "Research Proposal Registration",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR],
    workflow: {
      canEdit: (status: FormStatus, userRole: UserRole) => {
        // BM1 can only be edited in draft status, view only after submission
        return (
          status === FormStatus.DRAFT &&
          userRole === UserRole.PRINCIPAL_INVESTIGATOR
        );
      },
      canView: (_status: FormStatus, userRole: UserRole) => {
        return (
          userRole === UserRole.PRINCIPAL_INVESTIGATOR ||
          userRole === UserRole.STAFF
        );
      },
      nextStatus: (currentStatus: FormStatus, userRole: UserRole) => {
        if (
          currentStatus === FormStatus.DRAFT &&
          userRole === UserRole.PRINCIPAL_INVESTIGATOR
        ) {
          return FormStatus.SUBMITTED;
        }
        return currentStatus;
      },
    },
  },
  BM2: {
    id: "BM2",
    title:
      "Minutes of the meeting of the council to review the outline of the scientific research topic",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR],
    workflow: {
      canEdit: (status: FormStatus, userRole: UserRole) => {
        return (
          status === FormStatus.DRAFT &&
          userRole === UserRole.PRINCIPAL_INVESTIGATOR
        );
      },
      canView: (_status: FormStatus, userRole: UserRole) => {
        return (
          userRole === UserRole.PRINCIPAL_INVESTIGATOR ||
          userRole === UserRole.STAFF
        );
      },
      nextStatus: (currentStatus: FormStatus, userRole: UserRole) => {
        if (
          currentStatus === FormStatus.DRAFT &&
          userRole === UserRole.PRINCIPAL_INVESTIGATOR
        ) {
          return FormStatus.SUBMITTED;
        }
        return currentStatus;
      },
    },
  },
  BM3: {
    id: "BM3",
    title: "Project summary report",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR, UserRole.RESEARCHER],
    workflow: {
      canEdit: (status: FormStatus) => {
        return status === FormStatus.DRAFT;
      },
      canView: (_status: FormStatus, userRole: UserRole) => {
        return [
          UserRole.PRINCIPAL_INVESTIGATOR,
          UserRole.RESEARCHER,
          UserRole.STAFF,
        ].includes(userRole);
      },
      nextStatus: (currentStatus: FormStatus) => {
        if (currentStatus === FormStatus.DRAFT) {
          return FormStatus.SUBMITTED;
        }
        return currentStatus;
      },
    },
  },
  BM4: {
    id: "BM4",
    title: "Report on the progress of the scientific research topic",
    roles: [UserRole.RESEARCHER],
    workflow: {
      canEdit: (status: FormStatus, userRole: UserRole) => {
        return status === FormStatus.DRAFT && userRole === UserRole.RESEARCHER;
      },
      canView: (_status: FormStatus, userRole: UserRole) => {
        return [
          UserRole.RESEARCHER,
          UserRole.PRINCIPAL_INVESTIGATOR,
          UserRole.STAFF,
        ].includes(userRole);
      },
      nextStatus: (currentStatus: FormStatus, userRole: UserRole) => {
        if (
          currentStatus === FormStatus.DRAFT &&
          userRole === UserRole.RESEARCHER
        ) {
          return FormStatus.SUBMITTED;
        }
        return currentStatus;
      },
    },
  },
  BM5: {
    id: "BM5",
    title: "Research Contract",
    roles: [UserRole.PRINCIPAL_INVESTIGATOR, UserRole.STAFF],
    workflow: {
      canEdit: (
        status: FormStatus,
        userRole: UserRole,
        lastUpdatedBy: UserRole
      ) => {
        // BM5 can be edited back and forth between PI and Staff until finalized
        if (status === FormStatus.FINALIZED) return false;
        if (status === FormStatus.DRAFT) return true;

        // If Staff last updated, PI can edit
        if (
          lastUpdatedBy === UserRole.STAFF &&
          userRole === UserRole.PRINCIPAL_INVESTIGATOR
        ) {
          return true;
        }

        // If PI last updated, Staff can edit
        if (
          lastUpdatedBy === UserRole.PRINCIPAL_INVESTIGATOR &&
          userRole === UserRole.STAFF
        ) {
          return true;
        }

        return false;
      },
      canView: (_status: FormStatus, userRole: UserRole) => {
        return [UserRole.PRINCIPAL_INVESTIGATOR, UserRole.STAFF].includes(
          userRole
        );
      },
      nextStatus: (currentStatus: FormStatus, userRole: UserRole) => {
        if (currentStatus === FormStatus.DRAFT) {
          return userRole === UserRole.STAFF
            ? FormStatus.WAITING_FOR_PI
            : FormStatus.WAITING_FOR_STAFF;
        }
        if (
          currentStatus === FormStatus.WAITING_FOR_PI &&
          userRole === UserRole.PRINCIPAL_INVESTIGATOR
        ) {
          return FormStatus.WAITING_FOR_STAFF;
        }
        if (
          currentStatus === FormStatus.WAITING_FOR_STAFF &&
          userRole === UserRole.STAFF
        ) {
          return FormStatus.WAITING_FOR_PI;
        }
        return currentStatus;
      },
    },
  },
};

export type FormType = keyof typeof FORM_TYPES;

export interface FormData {
  [key: string]: string | number | boolean;
}

// Mock data for forms
export const MOCK_FORMS: FormMetadata[] = [
  {
    id: "form-1",
    formType: "BM1",
    title: "Research Proposal Registration BM1",
    projectId: "proj-1",
    projectTitle: "AI-Based Medical Diagnosis System",
    status: FormStatus.SUBMITTED,
    submissionDate: "2025-01-15",
    lastUpdated: "2025-01-15",
    lastUpdatedBy: UserRole.PRINCIPAL_INVESTIGATOR,
    lastUpdatedByName: "Dr. John Smith",
    createdBy: UserRole.PRINCIPAL_INVESTIGATOR,
    createdByName: "Dr. John Smith",
    content: "<p>Research proposal content...</p>",
    editHistory: [
      {
        id: "edit-1",
        timestamp: "2025-01-10",
        updatedBy: UserRole.PRINCIPAL_INVESTIGATOR,
        updatedByName: "Dr. John Smith",
        action: "created",
      },
      {
        id: "edit-2",
        timestamp: "2025-01-15",
        updatedBy: UserRole.PRINCIPAL_INVESTIGATOR,
        updatedByName: "Dr. John Smith",
        action: "submitted",
      },
    ],
  },
  {
    id: "form-2",
    formType: "BM5",
    title: "Research Contract BM5",
    projectId: "proj-1",
    projectTitle: "AI-Based Medical Diagnosis System",
    status: FormStatus.WAITING_FOR_PI,
    lastUpdated: "2025-01-20",
    lastUpdatedBy: UserRole.STAFF,
    lastUpdatedByName: "Sarah Johnson",
    createdBy: UserRole.STAFF,
    createdByName: "Sarah Johnson",
    content: "<p>Contract content...</p>",
    editHistory: [
      {
        id: "edit-3",
        timestamp: "2025-01-18",
        updatedBy: UserRole.STAFF,
        updatedByName: "Sarah Johnson",
        action: "created",
      },
      {
        id: "edit-4",
        timestamp: "2025-01-20",
        updatedBy: UserRole.STAFF,
        updatedByName: "Sarah Johnson",
        action: "updated",
      },
    ],
  },
  {
    id: "form-3",
    formType: "BM2",
    title: "Council Meeting Minutes BM2",
    projectId: "proj-2",
    projectTitle: "Sustainable Energy Solutions",
    status: FormStatus.FINALIZED,
    submissionDate: "2025-01-12",
    lastUpdated: "2025-01-12",
    lastUpdatedBy: UserRole.PRINCIPAL_INVESTIGATOR,
    lastUpdatedByName: "Dr. Maria Garcia",
    createdBy: UserRole.PRINCIPAL_INVESTIGATOR,
    createdByName: "Dr. Maria Garcia",
    content: "<p>Meeting minutes content...</p>",
  },
  {
    id: "form-4",
    formType: "BM5",
    title: "Research Contract BM5",
    projectId: "proj-2",
    projectTitle: "Sustainable Energy Solutions",
    status: FormStatus.FINALIZED,
    submissionDate: "2025-01-10",
    lastUpdated: "2025-01-10",
    lastUpdatedBy: UserRole.STAFF,
    lastUpdatedByName: "Michael Brown",
    createdBy: UserRole.PRINCIPAL_INVESTIGATOR,
    createdByName: "Dr. Maria Garcia",
    content: "<p>Finalized contract content...</p>",
  },
  {
    id: "form-5",
    formType: "BM1",
    title: "Research Proposal Registration BM1",
    projectId: "proj-3",
    projectTitle: "Blockchain Security Framework",
    status: FormStatus.DRAFT,
    lastUpdated: "2025-01-22",
    lastUpdatedBy: UserRole.PRINCIPAL_INVESTIGATOR,
    lastUpdatedByName: "Dr. Alex Chen",
    createdBy: UserRole.PRINCIPAL_INVESTIGATOR,
    createdByName: "Dr. Alex Chen",
    content: "<p>Draft proposal content...</p>",
  },
];
