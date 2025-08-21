// Shared constants for Staff module components

// Table Configuration Constants
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Status Options
export const USER_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Suspended", label: "Suspended" },
] as const;

export const GENERAL_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
] as const;

export const MEETING_STATUSES = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
] as const;

export const TRANSACTION_STATUSES = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Completed", label: "Completed" },
] as const;

// User Roles
export const USER_ROLES = [
  { value: "Staff", label: "Staff" },
  { value: "Admin", label: "Admin" },
  { value: "Super Admin", label: "Super Admin" },
] as const;

// Council Types
export const COUNCIL_TYPES = [
  { value: "Technical", label: "Technical Council" },
  { value: "Environmental", label: "Environmental Council" },
  { value: "Medical", label: "Medical Council" },
  { value: "Business", label: "Business Council" },
  { value: "Academic", label: "Academic Council" },
] as const;

// Meeting Types
export const MEETING_TYPES = [
  { value: "Milestone Review", label: "Milestone Review" },
  { value: "Proposal Evaluation", label: "Proposal Evaluation" },
  { value: "Final Review", label: "Final Review" },
  { value: "Progress Review", label: "Progress Review" },
] as const;

// Transaction Types
export const TRANSACTION_TYPES = [
  { value: "Payment", label: "Payment" },
  { value: "Refund", label: "Refund" },
  { value: "Adjustment", label: "Adjustment" },
] as const;

// Departments
export const DEPARTMENTS = [
  { value: "Administration", label: "Administration" },
  { value: "Academic Affairs", label: "Academic Affairs" },
  { value: "Research", label: "Research" },
  { value: "Finance", label: "Finance" },
  { value: "IT", label: "Information Technology" },
  { value: "HR", label: "Human Resources" },
] as const;

// Common Filter Options
export const FILTER_ALL_OPTION = { value: "all", label: "All" };

// Table Style Constants
export const TABLE_STYLES = {
  container:
    "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
  header: "bg-gray-50/50",
  headerCell: "font-semibold text-gray-900 px-4 py-3",
  cell: "px-4 py-3",
  row: "hover:bg-gray-50/50 transition-colors",
  emptyState: "text-center py-12 text-muted-foreground",
  pagination:
    "flex items-center justify-between px-4 py-3 border-t bg-gray-50/30",
} as const;

// Form Style Constants
export const FORM_STYLES = {
  container: "space-y-4 sm:space-y-6",
  section: "space-y-3 sm:space-y-4",
  field: "space-y-2",
  label: "text-sm font-medium text-gray-900",
  input: "w-full",
  error: "text-sm text-red-600",
  actions:
    "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 sm:pt-6",
} as const;

// Dialog Style Constants
export const DIALOG_STYLES = {
  content: "max-w-md w-full",
  header: "space-y-2",
  title: "text-lg font-semibold",
  description: "text-sm text-muted-foreground pt-0 pb-2",
  footer:
    "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4",
} as const;

// Button Variants
export const BUTTON_VARIANTS = {
  primary: "default",
  secondary: "outline",
  danger: "destructive",
  ghost: "ghost",
} as const;

// Icon Sizes
export const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
} as const;

// Animation Constants
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  debounceMs: 300,
  minLength: 2,
  placeholder: "Search...",
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  required: "This field is required",
  email: "Please enter a valid email address",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  invalidFormat: "Invalid format",
  duplicate: "This value already exists",
} as const;

// API Endpoints (relative to base URL)
export const API_ENDPOINTS = {
  users: "/api/staff/users",
  fields: "/api/staff/fields",
  majors: "/api/staff/majors",
  councils: "/api/staff/councils",
  meetings: "/api/staff/meetings",
  transactions: "/api/staff/transactions",
} as const;

// Permission Constants
export const PERMISSIONS = {
  users: {
    view: "users:view",
    create: "users:create",
    edit: "users:edit",
    delete: "users:delete",
    activate: "users:activate",
    deactivate: "users:deactivate",
  },
  fields: {
    view: "fields:view",
    create: "fields:create",
    edit: "fields:edit",
    delete: "fields:delete",
  },
  majors: {
    view: "majors:view",
    create: "majors:create",
    edit: "majors:edit",
    delete: "majors:delete",
  },
  councils: {
    view: "councils:view",
    create: "councils:create",
    edit: "councils:edit",
    delete: "councils:delete",
  },
  meetings: {
    view: "meetings:view",
    create: "meetings:create",
    edit: "meetings:edit",
    delete: "meetings:delete",
    cancel: "meetings:cancel",
  },
  transactions: {
    view: "transactions:view",
    create: "transactions:create",
    edit: "transactions:edit",
    approve: "transactions:approve",
    reject: "transactions:reject",
  },
} as const;

// Council statuses
export const COUNCIL_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Suspended", label: "Suspended" },
] as const;

// Export grouped constants
export const STAFF_CONSTANTS = {
  TABLE_STYLES,
  FORM_STYLES,
  DIALOG_STYLES,
  BUTTON_VARIANTS,
  ICON_SIZES,
  ANIMATION_DURATION,
  SEARCH_CONFIG,
  VALIDATION_MESSAGES,
  API_ENDPOINTS,
  PERMISSIONS,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} as const;
