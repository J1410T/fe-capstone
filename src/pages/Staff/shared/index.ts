// Shared exports for Staff module

// Types and interfaces
export * from "./types";

// Utilities and helpers
export * from "./utils";

// Constants
export * from "./constants";

// Components
export * from "./components";

// Re-export commonly used utilities with shorter names
export {
  cn,
  formatDate,
  formatDateTime,
  formatVND,
  getStatusColor,
  getTypeColor,
  validateEmail,
  validateRequired,
  searchInObject,
  filterByStatus,
  sortByField,
  generateId,
  debounce,
  getPaginationInfo,
} from "./utils";

// Re-export commonly used constants
export {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  USER_STATUSES,
  GENERAL_STATUSES,
  MEETING_STATUSES,
  TRANSACTION_STATUSES,
  USER_ROLES,
  COUNCIL_TYPES,
  MEETING_TYPES,
  TRANSACTION_TYPES,
  TABLE_STYLES,
  FORM_STYLES,
  DIALOG_STYLES,
} from "./constants";

// Re-export commonly used types
export type {
  BaseEntity,
  StaffUser,
  Field,
  Major,
  Council,
  Transaction,
  StaffMeeting,
  MeetingFormData,
  BulkMeetingData,
  TableColumn,
  TableConfig,
  FormField,
  FormConfig,
  FilterOption,
  SearchConfig,
  FilterConfig,
  ApiResponse,
  PaginatedResponse,
  Status,
  ActionType,
} from "./types";
