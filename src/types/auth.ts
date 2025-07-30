// types/auth.ts
export type AuthResponse = {
  token: string;
  "full-name": string;
  "avatar-url": string;
  email: string;
  "selected-role": string;
  roles: string[];
};

export type AuthInfo = {
  id: string;
  "identity-code": string;
  "full-name": string;
  email: string;
  "alternative-email": string;
  "phone-number": string;
  address: string;
  "date-of-birth": Date;
  gender: string;
  website: string;
  "facebook-url": string;
  "linked-in-url": string;
  "avatar-url": string;
  bio: string;
  degree: string;
  "degree-type": string;
  "proficiency-level": string;
  "company-name": string;
  "create-time": Date;
  status: string;
};

export interface Member {
  id: string;
  code: string;
  groupName: string;
  isOfficial: boolean | null;
  expireDate: string | null;
  createdAt: string | null;
  status: string | null;
  accountId: string | null;
  "full-name": string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  companyName: string | null;
  "avatar-url": string | null;
  roleId: string | null;
  name: string | null;
  projectId: string | null;
  appraisalCouncilId: string | null;
}

export interface StaffLoginRequest {
  email: string;
  password: string;
  "selected-role": string;
}

export type RoleItem = {
  id: string;
  name: string;
  "is-group-role": boolean;
  status: string;
};

export interface UserRole {
  id: string;
  code: string;
  "group-name": string;
  "is-official": boolean;
  "expire-date": string | null;
  "created-at": string;
  status: string;
  "account-id": string;
  "full-name": string;
  email: string;
  "avatar-url": string | null;
  "role-id": string;
  name: string;
  "project-id": string;
  "appraisal-council-id": string | null;
}

export interface UserRoleResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": UserRole[];
}

export interface CreateTaskRequest {
  name: string;
  description: string;
  "start-date": string;
  "end-date": string;
  priority: "Low" | "Medium" | "High";
  progress: number;
  "meeting-url": string | null;
  note: string;
  "milestone-id": string;
}

export interface CreateTaskResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  "start-date": string;
  "end-date": string;
  "delivery-date": string | null;
  priority: string;
  progress: number;
  overdue: number;
  "meeting-url": string | null;
  note: string;
  status: string;
  "milestone-id": string;
  "creator-id": string;
  "member-tasks": unknown[] | null;
}

export interface CreateMemberTaskRequest {
  progress: number;
  overdue: number;
  note: string;
  "member-id": string;
  "task-id": string;
}

export interface CreateMemberTaskResponse {
  id: string;
  progress: number;
  overdue: number;
  note: string;
  "delivery-date": string | null;
  "joined-at": string;
  status: string;
  "member-id": string;
  "task-id": string;
}

// types/auth.ts - Add these new types to existing file

export interface SearchAccountResult {
  id: string;
  "full-name": string;
  email: string;
  "avatar-url": string | null;
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  role?: string;
}

export interface GroupMember {
  id: string;
  code: string;
  groupName: string;
  isOfficial: boolean | null;
  expireDate: string | null;
  createdAt: string | null;
  status: string | null;
  accountId: string | null;
  "full-name": string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  companyName: string | null;
  "avatar-url": string | null;
  roleId: string | null;
  name: string | null;
  projectId: string | null;
  appraisalCouncilId: string | null;
  // Add these for component usage
  avatar?: string;
  role: "Researcher" | "Secretary" | "Leader";
  isInvitation?: boolean;
}
