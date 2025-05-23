import { useAuth, UserRole } from "@/contexts/AuthContext";
import { 
  hasPermission, 
  canAccessTab, 
  getAllowedTabs, 
  canViewSensitiveInfo,
  filterProjectData,
  PERMISSIONS 
} from "@/utils/permissions";

/**
 * Custom hook for permission checking
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * Check if current user has a specific permission
   */
  const checkPermission = (permission: string): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  };

  /**
   * Check if current user can access a specific tab
   */
  const checkTabAccess = (tabName: string): boolean => {
    if (!userRole) return false;
    return canAccessTab(userRole, tabName);
  };

  /**
   * Get tabs that current user can access
   */
  const getUserAllowedTabs = (): string[] => {
    if (!userRole) return ["overview"]; // Default to overview only
    return getAllowedTabs(userRole);
  };

  /**
   * Check if current user can view sensitive information
   */
  const checkSensitiveInfoAccess = (): boolean => {
    if (!userRole) return false;
    return canViewSensitiveInfo(userRole);
  };

  /**
   * Filter project data based on current user's permissions
   */
  const filterProjectForUser = (project: any) => {
    if (!userRole) return { ...project, budget: undefined, team: undefined, documents: undefined, tasks: undefined };
    return filterProjectData(project, userRole);
  };

  /**
   * Check if user can perform specific actions
   */
  const canViewProjectBudget = checkPermission(PERMISSIONS.VIEW_PROJECT_BUDGET);
  const canViewProjectTeam = checkPermission(PERMISSIONS.VIEW_PROJECT_TEAM);
  const canViewProjectDocuments = checkPermission(PERMISSIONS.VIEW_PROJECT_DOCUMENTS);
  const canViewProjectTasks = checkPermission(PERMISSIONS.VIEW_PROJECT_TASKS);
  const canManageProject = checkPermission(PERMISSIONS.MANAGE_PROJECT);
  const canEditProject = checkPermission(PERMISSIONS.EDIT_PROJECT);
  const canDeleteProject = checkPermission(PERMISSIONS.DELETE_PROJECT);
  const canViewAllProjects = checkPermission(PERMISSIONS.VIEW_ALL_PROJECTS);
  const canExportProjectData = checkPermission(PERMISSIONS.EXPORT_PROJECT_DATA);
  const canApproveProjects = checkPermission(PERMISSIONS.APPROVE_PROJECTS);

  return {
    // Permission checking functions
    checkPermission,
    checkTabAccess,
    getUserAllowedTabs,
    checkSensitiveInfoAccess,
    filterProjectForUser,
    
    // Specific permission flags
    canViewProjectBudget,
    canViewProjectTeam,
    canViewProjectDocuments,
    canViewProjectTasks,
    canManageProject,
    canEditProject,
    canDeleteProject,
    canViewAllProjects,
    canExportProjectData,
    canApproveProjects,
    
    // User info
    userRole,
    isAuthenticated: !!user,
  };
};
