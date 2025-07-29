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
