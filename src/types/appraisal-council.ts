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
