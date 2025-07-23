/**
 * Authentication utility functions
 * User authentication and session management utilities
 */

import { UserRole } from "@/contexts/AuthContext";
import { clearAuthCookies, getAccessToken } from "@/utils/cookie-manager";

/**
 * Token management utilities
 */
export const tokenUtils = {
  /**
   * Store authentication token
   */
  store: (): void => {
    // This function is deprecated - use cookie manager directly
    console.warn(
      "tokenUtils.store is deprecated - use cookie manager directly"
    );
  },

  /**
   * Get stored authentication token
   */
  get: (): string | null => {
    return getAccessToken();
  },

  /**
   * Remove authentication token
   */
  remove: (): void => {
    clearAuthCookies();
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
   * Store user session data (deprecated - use cookie manager directly)
   */
  storeUser: (): void => {
    console.warn(
      "sessionUtils.storeUser is deprecated - use cookie manager directly"
    );
  },

  /**
   * Get user session data (deprecated - use cookie manager directly)
   */
  getUser: (): Record<string, unknown> | null => {
    console.warn(
      "sessionUtils.getUser is deprecated - use cookie manager directly"
    );
    return null;
  },

  /**
   * Clear user session data (deprecated - use cookie manager directly)
   */
  clearUser: (): void => {
    console.warn(
      "sessionUtils.clearUser is deprecated - use cookie manager directly"
    );
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
    clearAuthCookies();
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
      [UserRole.RESEARCHER]: "Researcher",
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
