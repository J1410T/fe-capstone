/**
 * Component type definitions
 * Shared types for component props and interfaces
 */

import { type LucideIcon } from "lucide-react";
import { type ButtonProps } from "@/components/ui/button";
import { type BadgeProps } from "@/components/ui/badge";

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Size variants
export type ComponentSize = "sm" | "md" | "lg";

// Common action interface
export interface ComponentAction {
  label: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  icon?: LucideIcon;
  disabled?: boolean;
}

// Badge interface
export interface ComponentBadge {
  label: string;
  variant?: BadgeProps["variant"];
}

// Metadata interface
export interface ComponentMetadata {
  label: string;
  value: string | React.ReactNode;
}

// Select option interface
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
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

// Form field types
export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "date";

// Common form props
export interface BaseFormProps {
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  description?: string;
  className?: string;
}

// Dialog props
export interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

// Card variant types
export type CardVariant = "default" | "compact" | "detailed";

// Form section variant types
export type FormSectionVariant = "simple" | "card" | "bordered";

// Icon color classes (Tailwind)
export type IconColorClass =
  | "text-gray-500"
  | "text-blue-500"
  | "text-green-500"
  | "text-red-500"
  | "text-yellow-500"
  | "text-purple-500"
  | "text-indigo-500"
  | "text-pink-500";

// Loading states
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

// Error states
export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
}

// Pagination props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

// Search props
export interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

// Filter props
export interface FilterProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption[];
  placeholder?: string;
}

// Sort props
export interface SortProps<T = string> {
  sortBy: T;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: T, sortOrder: "asc" | "desc") => void;
}

// Table column definition
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

// File upload types
export interface FileUploadItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string;
}

// Notification types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

// Theme types
export type ThemeMode = "light" | "dark" | "system";

// Responsive breakpoints
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

// Animation types
export type AnimationType = "fade" | "slide" | "scale" | "bounce" | "none";

// Validation rule types
export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customMessage?: string;
  customValidator?: (value: unknown) => boolean | string;
}

// Form validation types
export type FormErrors<T = Record<string, unknown>> = Partial<
  Record<keyof T, string>
>;

// API response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Async state types
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// User role types (extend as needed)
export type UserRole =
  | "admin"
  | "user"
  | "moderator"
  | "guest"
  | "PI"
  | "Leader"
  | "staff"
  | "council";

// Permission types
export type Permission = "read" | "write" | "delete" | "admin";

// Route types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  roles?: UserRole[];
  permissions?: Permission[];
}
