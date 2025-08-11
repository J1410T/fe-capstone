import { User, UserRole } from "@/contexts/AuthContext";

/**
 * Evaluation permission utilities
 * Defines who can perform various evaluation-related actions
 */

export interface EvaluationPermissions {
  canCreateEvaluation: boolean;
  canCreateIndividualEvaluation: boolean;
  canEditEvaluation: boolean;
  canDeleteEvaluation: boolean;
  canViewEvaluation: boolean;
  canSubmitEvaluation: boolean;
  canApproveEvaluation: boolean;
}

/**
 * Get evaluation permissions for a user
 */
export const getEvaluationPermissions = (
  user: User | null
): EvaluationPermissions => {
  if (!user) {
    return {
      canCreateEvaluation: false,
      canCreateIndividualEvaluation: false,
      canEditEvaluation: false,
      canDeleteEvaluation: false,
      canViewEvaluation: false,
      canSubmitEvaluation: false,
      canApproveEvaluation: false,
    };
  }

  const isCouncilMember = user.role === UserRole.APPRAISAL_COUNCIL;
  const isStaffMember = user.role === UserRole.STAFF;
  const isResearcher = user.role === UserRole.RESEARCHER;
  const isPrincipalInvestigator = user.role === UserRole.PRINCIPAL_INVESTIGATOR;

  // Council members have full permissions
  if (isCouncilMember) {
    return {
      canCreateEvaluation: true,
      canCreateIndividualEvaluation: true,
      canEditEvaluation: true,
      canDeleteEvaluation: true,
      canViewEvaluation: true,
      canSubmitEvaluation: true,
      canApproveEvaluation: true,
    };
  }

  // Staff members have administrative permissions
  if (isStaffMember) {
    return {
      canCreateEvaluation: true,
      canCreateIndividualEvaluation: true,
      canEditEvaluation: true,
      canDeleteEvaluation: false, // Staff can't delete, only council can
      canViewEvaluation: true,
      canSubmitEvaluation: false, // Staff don't submit evaluations
      canApproveEvaluation: false, // Only council can approve
    };
  }

  // Researchers and PIs can only view evaluations
  if (isResearcher || isPrincipalInvestigator) {
    return {
      canCreateEvaluation: false,
      canCreateIndividualEvaluation: false,
      canEditEvaluation: false,
      canDeleteEvaluation: false,
      canViewEvaluation: true,
      canSubmitEvaluation: false,
      canApproveEvaluation: false,
    };
  }

  // Default: no permissions
  return {
    canCreateEvaluation: false,
    canCreateIndividualEvaluation: false,
    canEditEvaluation: false,
    canDeleteEvaluation: false,
    canViewEvaluation: false,
    canSubmitEvaluation: false,
    canApproveEvaluation: false,
  };
};

/**
 * Check if user can create evaluations
 */
export const canCreateEvaluation = (user: User | null): boolean => {
  return getEvaluationPermissions(user).canCreateEvaluation;
};

/**
 * Check if user can create individual evaluations
 */
export const canCreateIndividualEvaluation = (user: User | null): boolean => {
  return getEvaluationPermissions(user).canCreateIndividualEvaluation;
};

/**
 * Check if user can view evaluations
 */
export const canViewEvaluation = (user: User | null): boolean => {
  return getEvaluationPermissions(user).canViewEvaluation;
};

/**
 * Check if user can edit evaluations
 */
export const canEditEvaluation = (user: User | null): boolean => {
  return getEvaluationPermissions(user).canEditEvaluation;
};

/**
 * Check if user is council member
 */
export const isCouncilMember = (user: User | null): boolean => {
  return user?.role === UserRole.APPRAISAL_COUNCIL;
};

/**
 * Check if user is staff member
 */
export const isStaffMember = (user: User | null): boolean => {
  return user?.role === UserRole.STAFF;
};

/**
 * Check if user can edit a specific evaluation (must be the owner)
 */
export const canEditSpecificEvaluation = (
  user: User | null,
  evaluationOwnerId: string
): boolean => {
  if (!user) return false;

  // User must be the owner of the evaluation
  const isOwner = user.id === evaluationOwnerId;

  // User must also have general edit permissions
  const hasEditPermission = canEditEvaluation(user);

  return isOwner && hasEditPermission;
};

/**
 * Check if user has administrative privileges (council or staff)
 */
export const hasAdminPrivileges = (user: User | null): boolean => {
  return isCouncilMember(user) || isStaffMember(user);
};

/**
 * Get user role display name
 */
export const getUserRoleDisplayName = (user: User | null): string => {
  if (!user) return "Guest";

  switch (user.role) {
    case UserRole.APPRAISAL_COUNCIL:
      return "Council Member";
    case UserRole.STAFF:
      return "Staff Member";
    case UserRole.RESEARCHER:
      return "Researcher";
    case UserRole.PRINCIPAL_INVESTIGATOR:
      return "Principal Investigator";
    case UserRole.HOST_INSTITUTION:
      return "Host Institution";
    default:
      return "User";
  }
};

/**
 * Permission messages for UI display
 */
export const PERMISSION_MESSAGES = {
  CREATE_EVALUATION: "Only council members can create evaluations.",
  CREATE_INDIVIDUAL_EVALUATION:
    "Only council members can create individual evaluations.",
  EDIT_EVALUATION: "Only council and staff members can edit evaluations.",
  VIEW_ONLY: "You have view-only access to evaluations.",
  COUNCIL_ONLY: "This action is restricted to council members only.",
  ADMIN_ONLY: "This action requires administrative privileges.",
} as const;
