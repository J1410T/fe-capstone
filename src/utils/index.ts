/**
 * Consolidated Utilities
 * Central export point for all utility functions across the application
 */

// Core utilities
export * from "./core";
export * from "./date";
export * from "./validation";
export * from "./status";
export * from "./permission";
export * from "./project";
export * from "./types";
export * from "./suspense";

// Format utilities (specific exports to avoid conflicts)
export {
  formatCurrency,
  formatVND,
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

// AI content formatting utilities
export {
  formatAIContent,
  formatAIContentForTinyMCE,
  extractProjectDetails,
  type FormattedAIContent,
} from "./ai-content-formatter";
