// Shared utilities for ProjectDetailPage components

// Use centralized helpers
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatFileSize,
  calculateBudgetUtilization,
  validateEmail,
  getCategoryIcon,
  getCategoryColor,
  getStatusColor,
  generateId,
  isOverdue,
  calculateMilestoneProgress,
} from "@/utils";

export {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatFileSize,
  calculateBudgetUtilization,
  validateEmail,
  getCategoryIcon,
  getCategoryColor,
  getStatusColor,
  generateId,
  isOverdue,
  calculateMilestoneProgress,
};

// All utility functions are now imported from shared utilities above
// This file serves as a re-export point for ProjectDetail-specific usage
