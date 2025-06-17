/**
 * Status and badge utility functions
 * Consolidated from multiple files across the codebase
 * @module status
 */

// ============================================================================
// STATUS COLOR UTILITIES
// ============================================================================

/**
 * Get status color classes for badges and UI elements
 * Supports various status types across different contexts
 *
 * @param {string} status - The status to get colors for
 * @returns {string} Tailwind CSS classes for the status
 *
 * @example
 * getStatusColor('completed') // "bg-green-100 text-green-800 border-green-200"
 */
export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    // Success states
    case "completed":
    case "complete":
    case "approved":
    case "paid":
    case "active":
    case "success":
      return "bg-green-100 text-green-800 border-green-200";

    // In progress states
    case "in progress":
    case "processing":
    case "under review":
    case "submitted":
      return "bg-blue-100 text-blue-800 border-blue-200";

    // Pending/waiting states
    case "pending":
    case "draft":
    case "not started":
    case "to do":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    // Warning states
    case "on hold":
    case "suspended":
    case "incomplete":
      return "bg-orange-100 text-orange-800 border-orange-200";

    // Error/danger states
    case "overdue":
    case "rejected":
    case "missing":
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";

    // Neutral states
    case "cancelled":
    case "disabled":
    case "inactive":
      return "bg-gray-100 text-gray-800 border-gray-200";

    // Default fallback
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

/**
 * Get emerald-based status colors (legacy support)
 * @param {string} status - The status to get colors for
 * @returns {string} Tailwind CSS classes with emerald colors
 */
export const getStatusColorEmerald = (status: string): string => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "completed":
    case "complete":
    case "approved":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "in progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "overdue":
    case "suspended":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// ============================================================================
// CATEGORY COLOR UTILITIES
// ============================================================================

/**
 * Get category color classes for different project/budget categories
 *
 * @param {string} category - The category to get colors for
 * @returns {string} Tailwind CSS classes for the category
 *
 * @example
 * getCategoryColor('personnel') // "bg-blue-100 text-blue-800"
 */
export const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase().trim();

  switch (normalizedCategory) {
    case "personnel":
    case "staff":
    case "team":
      return "bg-blue-100 text-blue-800";

    case "equipment":
    case "hardware":
    case "tools":
      return "bg-purple-100 text-purple-800";

    case "travel":
    case "transportation":
    case "trip":
      return "bg-green-100 text-green-800";

    case "materials":
    case "supplies":
    case "resources":
      return "bg-orange-100 text-orange-800";

    case "other":
    case "miscellaneous":
    case "misc":
      return "bg-gray-100 text-gray-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Get category icon emoji for different categories
 *
 * @param {string} category - The category to get icon for
 * @returns {string} Emoji icon for the category
 *
 * @example
 * getCategoryIcon('personnel') // "👥"
 */
export const getCategoryIcon = (category: string): string => {
  const normalizedCategory = category.toLowerCase().trim();

  switch (normalizedCategory) {
    case "personnel":
    case "staff":
    case "team":
      return "👥";

    case "equipment":
    case "hardware":
    case "tools":
      return "🖥️";

    case "travel":
    case "transportation":
    case "trip":
      return "✈️";

    case "materials":
    case "supplies":
    case "resources":
      return "📦";

    case "other":
    case "miscellaneous":
    case "misc":
      return "📋";

    default:
      return "💰";
  }
};

// ============================================================================
// PRIORITY COLOR UTILITIES
// ============================================================================

/**
 * Get priority configuration with colors and styling
 *
 * @param {string} priority - The priority level
 * @returns {object} Configuration object with color classes
 *
 * @example
 * getPriorityConfig('high') // { color: "text-red-600", bgColor: "bg-red-50", ... }
 */
export const getPriorityConfig = (priority: string) => {
  const normalizedPriority = priority.toLowerCase().trim();

  switch (normalizedPriority) {
    case "high":
    case "urgent":
    case "critical":
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeColor: "bg-red-100 text-red-700",
        icon: "🔴",
      };

    case "medium":
    case "normal":
    case "moderate":
      return {
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        badgeColor: "bg-yellow-100 text-yellow-700",
        icon: "🟡",
      };

    case "low":
    case "minor":
      return {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        badgeColor: "bg-blue-100 text-blue-700",
        icon: "🔵",
      };

    default:
      return {
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        badgeColor: "bg-slate-100 text-slate-700",
        icon: "⚪",
      };
  }
};

// ============================================================================
// REPORT STATUS UTILITIES
// ============================================================================

/**
 * Get report status color classes
 *
 * @param {string} reports - The report status
 * @returns {string} Tailwind CSS classes for the report status
 */
export const getReportColor = (reports: string): string => {
  const normalizedReports = reports.toLowerCase().trim();

  switch (normalizedReports) {
    case "complete":
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";

    case "incomplete":
    case "partial":
      return "bg-amber-100 text-amber-800 border-amber-200";

    case "missing":
    case "not submitted":
      return "bg-red-100 text-red-800 border-red-200";

    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
