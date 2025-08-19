// Type definitions for detail view components

export interface SelectedMilestone {
  id: string;
  title: string;
  status: string;
}

export interface SelectedEvaluation {
  id: string;
  title: string;
  type: string;
}

export interface SelectedEvaluationStage {
  id: string;
  name: string;
  status: string;
}

export interface SelectedDocument {
  id: string;
  name: string;
  type: string;
}

export interface SelectedPIRequest {
  id: string;
  status: string;
  submittedAt: string;
  projectRegistrationDetails: {
    projectTitle: string;
    principalInvestigator: {
      name: string;
      email: string;
      department: string;
      position: string;
      cv: {
        content: string;
      };
    };
    projectDocuments?: Array<{
      content: string;
    }>;
    teamMembers?: Array<{
      name: string;
      email: string;
      role: string;
      department: string;
      cv: {
        content: string;
      };
    }>;
  };
}

export interface Council {
  id: string;
  name: string;
  description: string;
  chairperson: string;
  members: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
    expertise: string[];
  }>;
  specialization: string[];
  status: "active" | "inactive";
  createdAt: string;
  maxProjects: number;
  currentProjects: number;
}

export interface LegacyProject {
  id: string;
  "english-title": string;
  "vietnamese-title": string;
  status: string;
  "created-at": string;
  "creator-id": string;
  code: string;
  language: string;
  category: string;
  type: string;
  genre: string;
  "maximum-member": number;
  progress: number;
  "updated-at"?: string;
  majors: Array<{ id: string; name: string }>;
  "project-tags": Array<{ name: string }>;
  assignedCouncil?: Council;
  // Additional fields from API
  abbreviations?: string;
  duration?: number;
  description?: string;
  "requirement-note"?: string;
  creator?: {
    id: string;
    "full-name": string;
    email: string;
    "avatar-url": string;
  };
}
