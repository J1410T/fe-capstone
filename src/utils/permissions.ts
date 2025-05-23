import { UserRole } from "@/contexts/AuthContext";

/**
 * Permission constants for different features
 */
export const PERMISSIONS = {
  // Project viewing permissions
  VIEW_PROJECT_BASIC: "view_project_basic",
  VIEW_PROJECT_BUDGET: "view_project_budget",
  VIEW_PROJECT_TEAM: "view_project_team",
  VIEW_PROJECT_DOCUMENTS: "view_project_documents",
  VIEW_PROJECT_TASKS: "view_project_tasks",
  VIEW_PROJECT_FULL: "view_project_full",
  
  // Project management permissions
  MANAGE_PROJECT: "manage_project",
  EDIT_PROJECT: "edit_project",
  DELETE_PROJECT: "delete_project",
  
  // Administrative permissions
  VIEW_ALL_PROJECTS: "view_all_projects",
  EXPORT_PROJECT_DATA: "export_project_data",
  APPROVE_PROJECTS: "approve_projects",
} as const;

/**
 * Role-based permission mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.MEMBER]: [
    PERMISSIONS.VIEW_PROJECT_BASIC,
  ],
  [UserRole.PRINCIPAL_INVESTIGATOR]: [
    PERMISSIONS.VIEW_PROJECT_BASIC,
    PERMISSIONS.VIEW_PROJECT_TASKS,
    PERMISSIONS.VIEW_PROJECT_TEAM,
    PERMISSIONS.VIEW_PROJECT_DOCUMENTS,
    PERMISSIONS.MANAGE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
  ],
  [UserRole.HOST_INSTITUTION]: [
    PERMISSIONS.VIEW_PROJECT_FULL,
    PERMISSIONS.VIEW_PROJECT_BUDGET,
    PERMISSIONS.VIEW_PROJECT_TEAM,
    PERMISSIONS.VIEW_PROJECT_DOCUMENTS,
    PERMISSIONS.VIEW_PROJECT_TASKS,
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.MANAGE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.EXPORT_PROJECT_DATA,
  ],
  [UserRole.APPRAISAL_COUNCIL]: [
    PERMISSIONS.VIEW_PROJECT_BASIC,
    PERMISSIONS.VIEW_PROJECT_TASKS,
    PERMISSIONS.VIEW_PROJECT_DOCUMENTS,
    PERMISSIONS.APPROVE_PROJECTS,
  ],
  [UserRole.STAFF]: [
    PERMISSIONS.VIEW_PROJECT_FULL,
    PERMISSIONS.VIEW_PROJECT_BUDGET,
    PERMISSIONS.VIEW_PROJECT_TEAM,
    PERMISSIONS.VIEW_PROJECT_DOCUMENTS,
    PERMISSIONS.VIEW_PROJECT_TASKS,
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.MANAGE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.EXPORT_PROJECT_DATA,
    PERMISSIONS.APPROVE_PROJECTS,
  ],
};

/**
 * Check if a user role has a specific permission
 */
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.includes(permission);
};

/**
 * Check if a user role can access a specific project tab
 */
export const canAccessTab = (userRole: UserRole, tabName: string): boolean => {
  switch (tabName) {
    case "overview":
      return hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_BASIC);
    case "tasks":
      return hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_TASKS);
    case "team":
      return hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_TEAM);
    case "documents":
      return hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_DOCUMENTS);
    case "budget":
      return hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_BUDGET);
    default:
      return false;
  }
};

/**
 * Get allowed tabs for a user role
 */
export const getAllowedTabs = (userRole: UserRole): string[] => {
  const tabs = ["overview", "tasks", "team", "documents", "budget"];
  return tabs.filter(tab => canAccessTab(userRole, tab));
};

/**
 * Check if user can view sensitive project information
 */
export const canViewSensitiveInfo = (userRole: UserRole): boolean => {
  return hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_BUDGET) ||
         hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_FULL);
};

/**
 * Filter project data based on user permissions
 */
export const filterProjectData = (project: any, userRole: UserRole) => {
  const filteredProject = { ...project };
  
  // Remove sensitive information for users without proper permissions
  if (!hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_BUDGET)) {
    delete filteredProject.budget;
  }
  
  if (!hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_TEAM)) {
    delete filteredProject.team;
  }
  
  if (!hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_DOCUMENTS)) {
    delete filteredProject.documents;
  }
  
  if (!hasPermission(userRole, PERMISSIONS.VIEW_PROJECT_TASKS)) {
    delete filteredProject.tasks;
  }
  
  return filteredProject;
};
