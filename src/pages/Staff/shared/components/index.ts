// Shared components for Staff module

export { default as DataTable } from "./DataTable";
export { default as StatusBadge } from "./StatusBadge";
export { default as ActionButtons, createCommonActions } from "./ActionButtons";
export { default as PageHeader } from "./PageHeader";
export { default as FormDialog } from "./FormDialog";
export {
  default as ConfirmDialog,
  createConfirmDialogs,
} from "./ConfirmDialog";
export { default as FilterBar } from "./FilterBar";

// Re-export types
export type { ActionItem } from "./ActionButtons";
