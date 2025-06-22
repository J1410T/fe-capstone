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
  sortByDate,
  filterByStatus,
  searchItems,
  calculateMilestoneProgress,
} from "@/shared/utils/helpers";

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
  sortByDate,
  filterByStatus,
  searchItems,
  calculateMilestoneProgress,
};

// All utility functions are now imported from shared utilities above
// This file serves as a re-export point for ProjectDetail-specific usage
