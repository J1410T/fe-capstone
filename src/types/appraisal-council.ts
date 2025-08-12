/**
 * Appraisal Council types and interfaces
 */

import { UserRole } from "./auth";

// Base AppraisalCouncil interface matching API response
export interface AppraisalCouncil {
  id: string;
  code: string;
  name: string;
  "created-at": string;
  "updated-at": string;
  status: "created" | "deleted";
  member?: UserRole[];
}

// Extended AppraisalCouncil with members for UI display
export interface AppraisalCouncilWithMembers extends AppraisalCouncil {
  member?: UserRole[];
  memberCount?: number;
  president?: string; // Chairman's name
}

// API Response for AppraisalCouncil list
export interface AppraisalCouncilListResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": AppraisalCouncil[];
}

// API Request for AppraisalCouncil list
export interface AppraisalCouncilListRequest {
  "key-word": string;
  "page-index": number;
  "page-size": number;
}

// API Request for creating AppraisalCouncil
export interface CreateAppraisalCouncilRequest {
  code: string;
  name: string;
  status: "created";
}

// API Request for updating AppraisalCouncil
export interface UpdateAppraisalCouncilRequest {
  id: string;
  code: string;
  name: string;
  status: "created" | "deleted";
}

// Member selection interface for UI
export interface SelectedMember {
  id: string;
  "account-id": string;
  "full-name": string;
  email: string;
  "avatar-url": string | null;
  isChairman: boolean;
  "role-id": string;
}

// UserRole filter request for appraisal council members
export interface UserRoleByCouncilRequest {
  "appraisal-council-id": string;
  status: "Approved";
  "page-index": number;
  "page-size": number;
}

// Role information for member assignment
export interface RoleInfo {
  id: string;
  name: string;
}

export interface AppraisalCouncilByProject {
  id: string;
  code: string;
  name: string;
  "created-at": string;
  "updated-at": string;
  status: "created" | "deleted";
  evaluations: null;
  "evaluation-stages": null;
  "council-members": null;
}

export interface AppraisalCouncilListRequest {
  "key-word": string;
  "page-index": number;
  "page-size": number;
  status?: "created" | "deleted";
}

export interface AssignCouncilToProjectRequest {
  sourceProjectId: string;
  appraisalCouncilId: string;
}

// Response when no council is assigned to project (404 case)
export interface NoCouncilAssignedError {
  status: 404;
  message: "Not found any Appraisal Council belongs to this ProjectId";
}

// Success response for council assignment
export interface AssignCouncilSuccessResponse {
  status: 200;
  message: "Appraisal Council assigned successfully.";
}
