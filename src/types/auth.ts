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
  token: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  role: string;
  roles: string[];
};

export type User = {
  id?: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: string;
  roles: string[];
};

export type LoginRequest = {
  role: string;
  returnUrl?: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
};
