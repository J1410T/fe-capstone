/**
 * Consolidated utility types
 * Common type definitions used across utility functions
 */

// File upload types
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// Status types
export type StatusType =
  | "completed"
  | "complete"
  | "approved"
  | "paid"
  | "active"
  | "success"
  | "in progress"
  | "processing"
  | "under review"
  | "submitted"
  | "pending"
  | "draft"
  | "not started"
  | "to do"
  | "on hold"
  | "suspended"
  | "incomplete"
  | "overdue"
  | "rejected"
  | "cancelled"
  | "missing"
  | "failed"
  | "disabled"
  | "inactive";

// Priority types
export type PriorityType =
  | "high"
  | "urgent"
  | "critical"
  | "medium"
  | "normal"
  | "moderate"
  | "low"
  | "minor";

// Category types
export type CategoryType =
  | "personnel"
  | "staff"
  | "team"
  | "equipment"
  | "hardware"
  | "tools"
  | "travel"
  | "transportation"
  | "trip"
  | "materials"
  | "supplies"
  | "resources"
  | "other"
  | "miscellaneous"
  | "misc";

// Validation rule types
export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customMessage?: string;
}

// Form validation types
export type FormErrors = Record<string, string>;
export type FormData = Record<string, string>;
export type ValidationRules = Record<string, ValidationRule>;

// Date filter types
export type DateFilterType = "all" | "overdue" | "today" | "week" | "month";

// Search and filter types
export interface SearchableItem extends Record<string, unknown> {
  id: string;
}

export interface FilterableByStatus {
  status: string;
}

export interface FilterableByDate {
  date: string;
}

// Priority configuration
export interface PriorityConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  icon: string;
}

// File validation result
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// Password validation requirements
export interface PasswordRequirements {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

// Password validation result
export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}
