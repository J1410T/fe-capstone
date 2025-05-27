// Define user roles
export enum UserRole {
  MEMBER = "Member",
  APPRAISAL_COUNCIL = "Appraisal council",
  HOST_INSTITUTION = "Host Institution",
  PRINCIPAL_INVESTIGATOR = "Principal Investigator",
  STAFF = "Staff",
}

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  accessToken?: string;
}

// Define JWT token payload interface
export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  picture: string;
  role: UserRole;
  exp: number;
}

// Define auth context interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}
