/**
 * Status and badge utility functions
 * Consolidated from multiple files across the codebase
 */

import React from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

/**
 * Get status color classes for badges and UI elements
 * Supports various status types across different contexts
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
 */
export const getStatusColorEmerald = (status: string): string => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "approved":
      return "bg-green-200 text-green-800 border-green-200";
    case "done":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "in progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "submitted":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "deleted":
      return "bg-red-100 text-red-800 border-red-200";
    case "draft":
      return "bg-slate-100 text-slate-800 border-slate-200";
    case "created":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

/**
 * Get status icon component
 */
export const getStatusIcon = (status: string): React.ReactElement | null => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "completed":
    case "complete":
    case "approved":
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case "in progress":
    case "processing":
      return <Clock className="h-4 w-4 mr-1" />;
    case "pending":
    case "draft":
      return <AlertCircle className="h-4 w-4 mr-1" />;
    case "suspended":
    case "rejected":
      return <XCircle className="h-4 w-4 mr-1" />;
    case "incomplete":
    case "missing":
      return <AlertTriangle className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

/**
 * Get category color classes for different project/budget categories
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

/**
 * Get priority configuration with colors and styling
 */
export const getPriorityConfig = (priority: string) => {
  const normalizedPriority = priority.toLowerCase().trim();

  switch (normalizedPriority) {
    case "high":
    case "urgent":
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeColor: "bg-red-100 text-red-800",
      };

    case "medium":
    case "normal":
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        badgeColor: "bg-yellow-100 text-yellow-800",
      };

    case "low":
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        badgeColor: "bg-green-100 text-green-800",
      };

    default:
      return {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        badgeColor: "bg-gray-100 text-gray-800",
      };
  }
};

/**
 * Get report status color
 */
export const getReportColor = (reports: string): string => {
  const normalizedReports = reports.toLowerCase().trim();

  switch (normalizedReports) {
    case "complete":
      return "bg-green-100 text-green-800";
    case "incomplete":
      return "bg-yellow-100 text-yellow-800";
    case "missing":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Get report status icon
 */
export const getReportIcon = (reports: string): React.ReactElement | null => {
  const normalizedReports = reports.toLowerCase().trim();

  switch (normalizedReports) {
    case "complete":
      return <CheckCircle className="h-4 w-4" />;
    case "incomplete":
      return <AlertTriangle className="h-4 w-4" />;
    case "missing":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};
