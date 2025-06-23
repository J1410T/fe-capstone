/**
 * Authentication utility functions
 * Role-based utilities and helpers
 */

import { UserRole } from "@/contexts/AuthContext";

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
      [UserRole.MEMBER]: "Member",
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
      [UserRole.MEMBER]: "bg-blue-100 text-blue-800",
      [UserRole.PRINCIPAL_INVESTIGATOR]: "bg-green-100 text-green-800",
      [UserRole.HOST_INSTITUTION]: "bg-purple-100 text-purple-800",
      [UserRole.APPRAISAL_COUNCIL]: "bg-orange-100 text-orange-800",
      [UserRole.STAFF]: "bg-red-100 text-red-800",
    };

    return roleColors[role] || "bg-gray-100 text-gray-800";
  },
};
