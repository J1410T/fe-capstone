// Types for Project Management components
import React from "react";

export interface ProjectDocument {
  id: string;
  name: string;
  type:
    | "proposal"
    | "milestone"
    | "evaluation"
    | "requirement"
    | "cv"
    | "supporting";
  content: string; // TinyMCE HTML content
  uploadedAt: string;
  uploadedBy: string;
  size?: string;
}

export interface ProjectClone {
  id: string;
  name: string;
  status: "active" | "pending" | "approved" | "rejected";
  council?: string;
  createdAt: string;
  proposals: Proposal[];
  evaluations: ProjectEvaluation[];
  documents: ProjectDocument[];
}

export interface Proposal {
  id: string;
  title: string;
  pi: string;
  status: "draft" | "submitted" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  objectives?: string;
  members?: string[];
  timeline?: string;
  documents: ProjectDocument[];
}

export interface ProjectEvaluation {
  id: string;
  milestone: string;
  reviewer: string;
  score?: number;
  status: "pending" | "completed" | "in_progress";
  submittedAt?: string;
  comments?: string;
  documents: ProjectDocument[];
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  department: string;
  cv: ProjectDocument;
}

export interface PrincipalInvestigator {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  cv: ProjectDocument;
}

export interface ProjectRegistrationDetails {
  projectTitle: string;
  principalInvestigator: PrincipalInvestigator;
  teamMembers: TeamMember[];
  projectDocuments: ProjectDocument[];
}

export interface PIRequest {
  id: string;
  projectId: string;
  cloneId?: string;
  requestType:
    | "council_assignment"
    | "deadline_extension"
    | "budget_adjustment"
    | "member_change";
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  description: string;
  documents: ProjectDocument[];
  projectRegistrationDetails?: ProjectRegistrationDetails;
}

export interface EnhancedMilestone {
  id: string;
  title: string;
  scheduledDate: string;
  status: "completed" | "ongoing" | "upcoming";
  description?: string;
  documents: ProjectDocument[];
  evaluationStage?: "not_started" | "in_progress" | "completed";
  evaluators?: string[];
  evaluationData?: {
    score?: number;
    comments?: string;
    submittedAt?: string;
    status: "pending" | "approved" | "rejected";
    documents?: ProjectDocument[];
  };
  evaluationStageDocuments?: ProjectDocument[];
}

export interface ProjectMajor {
  id: string;
  name: string;
}

export interface ProjectTag {
  name: string;
}

export interface Project {
  id: string;
  "english-title": string;
  "vietnamese-title": string;
  code: string;
  status: "created" | "in_progress" | "completed" | "cancelled";
  genre: "normal" | "propose";
  language: string;
  "maximum-member": number;
  progress: number;
  "created-at": string;
  "creator-id": string;
  majors: ProjectMajor[];
  "project-tags": ProjectTag[];
  council?: string; // Added council assignment at project level
}

export interface EnhancedProject extends Project {
  viewType?: "documents" | "milestones";
  allDocuments?: ProjectDocument[];
  allMilestones?: EnhancedMilestone[];
}

export type StatusType =
  | "project"
  | "proposal"
  | "clone"
  | "evaluation"
  | "request"
  | "milestone";

export interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}
