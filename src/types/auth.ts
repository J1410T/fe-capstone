// types/auth.ts
export type GoogleAuthResponse = {
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

export type Member = {
  id: string;
  code: string;
  groupName: string;
  isOfficial: boolean;
  expireDate: string;
  createdAt: string;
  status: string;
  accountId: string;
  roleId: string;
  projectId: string;
  appraisalCouncilId: string;
};
