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
  "group-name": string | null;
  "is-official": boolean | null;
  "expire-date": string | null;
  "created-at": string | null;
  status: string | null;
  "account-id": string | null;
  "full-name": string | null;
  email: string | null;
  "avatar-url": string | null;
  "role-id": string | null;
  name: string | null;
  "project-id": string | null;
  "appraisal-council-id": string | null;
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

export interface CreateUserRoleRequest {
  "account-id": string;
  "role-id": string;
  "project-id"?: string;
  "appraisal-council-id"?: string;
  status?: string;
}

export interface UpdateUserRoleRequest {
  "account-id": string;
  "role-id": string;
  "project-id"?: string | null;
  "appraisal-council-id"?: string | null;
  status?: string;
}
export interface UserRoleFilterRequest {
  "account-id"?: string;
  "project-id"?: string;
  "role-id"?: string;
  status?: string;
  "page-index": number;
  "page-size": number;
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
export interface SearchAccountsParams {
  input: string;
  roleUser?: string;
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

// New types for Users Management
export interface UserFilterRequest {
  "full-name"?: string;
  email?: string;
  "sort-by"?: string;
  desc?: boolean;
  "page-index": number;
  "page-size": number;
}

export interface UserFilterResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": UserAccount[];
}

export interface UserAccount {
  id: string;
  "identity-code": string;
  "full-name": string;
  email: string;
  "alternative-email": string | null;
  "phone-number": string | null;
  address: string | null;
  "date-of-birth": string | null;
  gender: string | null;
  website: string | null;
  "facebook-url": string | null;
  "linked-in-url": string | null;
  "avatar-url": string | null;
  bio: string | null;
  degree: string | null;
  "degree-type": string | null;
  "professional-level": string | null;
  "company-name": string | null;
  "create-time": string;
  status: "created" | "deleted" | "pending";
  "major-id": string | null;
  UserRole?: UserRoleInfo[];
}

export interface UserRoleInfo {
  id: string;
  "role-id": string;
  name: string;
}

export interface UserAccountWithRoles extends UserAccount {
  UserRole: UserRoleInfo[];
}

export interface CreateUserRequest {
  "full-name": string;
  email: string;
  password: string;
}

export interface UpdateUserStatusRequest {
  status: "created" | "deleted";
}

export interface TeamMember {
  id: string;
  accountId: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  scientificCV?: string;
}
