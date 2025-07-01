/**
 * Authentication utility functions
 * User authentication and session management utilities
 */

import { UserRole } from "@/contexts/AuthContext";

/**
 * Mock authentication utilities (for testing and development)
 */
export const mockAuth = {
  /**
   * Mock login function
   */
  login: async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data based on email
    const mockUsers = {
      "RESEARCHER@test.com": {
        role: UserRole.RESEARCHER,
        name: "Test RESEARCHER",
      },
      "pi@test.com": { role: UserRole.PRINCIPAL_INVESTIGATOR, name: "Test PI" },
      "host@test.com": { role: UserRole.HOST_INSTITUTION, name: "Test Host" },
      "council@test.com": {
        role: UserRole.APPRAISAL_COUNCIL,
        name: "Test Council",
      },
      "staff@test.com": { role: UserRole.STAFF, name: "Test Staff" },
    };

    const user = mockUsers[email as keyof typeof mockUsers];
    if (user && password === "password") {
      return {
        id: "mock-id",
        email,
        name: user.name,
        role: user.role,
        token: "mock-jwt-token",
      };
    }

    throw new Error("Invalid credentials");
  },

  /**
   * Mock logout function
   */
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem("auth-token");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth-token");
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const userData = localStorage.getItem("user-data");
    return userData ? JSON.parse(userData) : null;
  },
};

/**
 * Token management utilities
 */
export const tokenUtils = {
  /**
   * Store authentication token
   */
  store: (token: string): void => {
    localStorage.setItem("auth-token", token);
  },

  /**
   * Get stored authentication token
   */
  get: (): string | null => {
    return localStorage.getItem("auth-token");
  },

  /**
   * Remove authentication token
   */
  remove: (): void => {
    localStorage.removeItem("auth-token");
  },

  /**
   * Check if token is expired (basic check)
   */
  isExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  /**
   * Decode JWT token payload
   */
  decode: (token: string): Record<string, unknown> | null => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  },
};

/**
 * Session management utilities
 */
export const sessionUtils = {
  /**
   * Store user session data
   */
  storeUser: (userData: Record<string, unknown>): void => {
    localStorage.setItem("user-data", JSON.stringify(userData));
  },

  /**
   * Get user session data
   */
  getUser: (): Record<string, unknown> | null => {
    const userData = localStorage.getItem("user-data");
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Clear user session data
   */
  clearUser: (): void => {
    localStorage.removeItem("user-data");
  },

  /**
   * Check if session is valid
   */
  isValid: (): boolean => {
    const token = tokenUtils.get();
    return token ? !tokenUtils.isExpired(token) : false;
  },

  /**
   * Clear all session data
   */
  clearAll: (): void => {
    tokenUtils.remove();
    sessionUtils.clearUser();
    localStorage.removeItem("reRESEARCHER-me");
  },
};

/**
 * Role-based utilities
 */
export const roleUtils = {
  /**
   * Check if user has a specific role
   */
  hasRole: (userRole: UserRole, requiredRole: UserRole): boolean => {
    return userRole === requiredRole;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(userRole);
  },

  /**
   * Get role display name
   */
  getRoleDisplayName: (role: UserRole): string => {
    const roleNames = {
      [UserRole.RESEARCHER]: "RESEARCHER",
      [UserRole.PRINCIPAL_INVESTIGATOR]: "Principal Investigator",
      [UserRole.HOST_INSTITUTION]: "Host Institution",
      [UserRole.APPRAISAL_COUNCIL]: "Appraisal Council",
      [UserRole.STAFF]: "Staff",
    };

    return roleNames[role] || "Unknown Role";
  },

  /**
   * Get role color for UI
   */
  getRoleColor: (role: UserRole): string => {
    const roleColors = {
      [UserRole.RESEARCHER]: "bg-blue-100 text-blue-800",
      [UserRole.PRINCIPAL_INVESTIGATOR]: "bg-green-100 text-green-800",
      [UserRole.HOST_INSTITUTION]: "bg-purple-100 text-purple-800",
      [UserRole.APPRAISAL_COUNCIL]: "bg-orange-100 text-orange-800",
      [UserRole.STAFF]: "bg-red-100 text-red-800",
    };

    return roleColors[role] || "bg-gray-100 text-gray-800";
  },
};

/**
 * Generate a mock JWT token
 */
const generateMockJWT = (payload: Record<string, unknown>): string => {
  // Create mock JWT header
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  // Set expiration time to 24 hours from now
  const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  const fullPayload = {
    ...payload,
    exp,
    iat: Math.floor(Date.now() / 1000),
  };

  // Base64 encode header and payload
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(fullPayload));

  // Create a mock signature (just base64 encoded string for testing)
  const mockSignature = btoa("mock-signature");

  // Return JWT-like token
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

/**
 * Mock user login function for different roles
 */
export const mockUserLogin = (role: UserRole) => {
  const mockCredentials = {
    [UserRole.RESEARCHER]: {
      credential: {
        email: "RESEARCHER@test.com",
        password: "password",
        role: UserRole.RESEARCHER,
        name: "Test RESEARCHER",
        token: generateMockJWT({
          sub: "RESEARCHER-123",
          name: "Test RESEARCHER",
          email: "RESEARCHER@test.com",
          picture: "",
          role: UserRole.RESEARCHER,
        }),
      },
    },
    [UserRole.PRINCIPAL_INVESTIGATOR]: {
      credential: {
        email: "pi@test.com",
        password: "password",
        role: UserRole.PRINCIPAL_INVESTIGATOR,
        name: "Test PI",
        token: generateMockJWT({
          sub: "pi-123",
          name: "Test PI",
          email: "pi@test.com",
          picture: "",
          role: UserRole.PRINCIPAL_INVESTIGATOR,
        }),
      },
    },
    [UserRole.HOST_INSTITUTION]: {
      credential: {
        email: "host@test.com",
        password: "password",
        role: UserRole.HOST_INSTITUTION,
        name: "Test Host",
        token: generateMockJWT({
          sub: "host-123",
          name: "Test Host",
          email: "host@test.com",
          picture: "",
          role: UserRole.HOST_INSTITUTION,
        }),
      },
    },
    [UserRole.APPRAISAL_COUNCIL]: {
      credential: {
        email: "council@test.com",
        password: "password",
        role: UserRole.APPRAISAL_COUNCIL,
        name: "Test Council",
        token: generateMockJWT({
          sub: "council-123",
          name: "Test Council",
          email: "council@test.com",
          picture: "",
          role: UserRole.APPRAISAL_COUNCIL,
        }),
      },
    },
    [UserRole.STAFF]: {
      credential: {
        email: "staff@test.com",
        password: "password",
        role: UserRole.STAFF,
        name: "Test Staff",
        token: generateMockJWT({
          sub: "staff-123",
          name: "Test Staff",
          email: "staff@test.com",
          picture: "",
          role: UserRole.STAFF,
        }),
      },
    },
  };

  return mockCredentials[role] || mockCredentials[UserRole.RESEARCHER];
};

/**
 * Authentication validation utilities
 */
export const authValidation = {
  /**
   * Validate email format
   */
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  validatePassword: (
    password: string
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
