/**
 * Legacy compatibility utilities
 * This file provides backward compatibility for old import paths
 * TODO: Remove this file after migration is complete
 */

// Re-export from new locations for backward compatibility
export * from "./core";
export * from "./api";
export * from "./date";
export * from "./string";
export * from "./validation";
export * from "./status";
export * from "./permission";
export * from "./project";
export * from "./auth";

// Separate export for format to avoid naming conflicts
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

// File utilities with renamed exports to avoid conflicts
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
  formatFileSize as formatFileSizeBytes,
} from "./file";

// Legacy functions that might still be used (aliases)
export { cn as classNames } from "./core";
export { formatDate as dateFormat } from "./date";
export { formatCurrency as currencyFormat } from "./format";
export { truncateString as truncate } from "./string";
export { validateEmail as isValidEmail } from "./validation";

// Legacy API utilities
export { api as apiUtils } from "./api";

// Legacy permission utilities
export { hasPermission as checkPermission } from "./permission";

// NOTE: These legacy exports will be removed in a future version
// Please update your imports to use the new utility structure
