/**
 * Consolidated Utilities
 * Central export point for all utility functions across the application
 */

// Core utilities
export * from "./core";
export * from "./auth";
export * from "./api";
export * from "./date";
export * from "./string";
export * from "./validation";
export * from "./status";
export * from "./permission";
export * from "./project";
export * from "./types";
export * from "./suspense";

// Format utilities (specific exports to avoid conflicts)
export {
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateBudgetUtilization,
  calculateProgress,
  calculateMilestoneProgress,
  formatDuration,
  truncateText,
  formatPhoneNumber,
} from "./format";

// File utilities (specific exports to avoid conflicts)
export {
  validateFileUpload,
  getFileExtension,
  getFileNameWithoutExtension,
  isImageFile,
  isDocumentFile,
  fileToBase64,
  fileToText,
  downloadFile,
  downloadContent,
  getFileIcon,
  compressImage,
  formatFileSize,
} from "./file";

// Legacy compatibility - will be removed in future versions
export * from "./legacy";
