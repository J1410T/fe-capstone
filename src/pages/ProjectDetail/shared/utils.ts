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
<<<<<<< HEAD
  calculateMilestoneProgress,
} from "@/utils";
=======
  sortByDate,
  filterByStatus,
  searchItems,
  calculateMilestoneProgress,
} from "@/shared/utils/helpers";
>>>>>>> e2eea07370f2f74e9ee2bf9e8b1500b8ad014cf9

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
<<<<<<< HEAD
=======
  sortByDate,
  filterByStatus,
  searchItems,
>>>>>>> e2eea07370f2f74e9ee2bf9e8b1500b8ad014cf9
  calculateMilestoneProgress,
};

// All utility functions are now imported from shared utilities above
// This file serves as a re-export point for ProjectDetail-specific usage
