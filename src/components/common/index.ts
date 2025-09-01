/**
 * Common components barrel export
 * Centralized exports for reusable components
 */

// Core common components
export * from "./ComingSoon";
export * from "./ErrorFallback";

// Status and badge components
export { StatusBadge, UnifiedStatusBadge } from "./StatusBadge";

// Dialog components
export { ConfirmDialog } from "./ConfirmDialog";

// File upload components
export { FileUploadComponent as FileUpload } from "./FileUpload";

// Data display components
export { DataCard, UnifiedDataCard } from "./DataCard";

// User search and invitation components
export { UserSearchInput } from "./UserSearchInput";
export { CollaboratorInvitation } from "./CollaboratorInvitation";
export type { InvitedUser } from "./UserSearchInput";

// Simplified user search components
export { SimpleUserSearch } from "./SimpleUserSearch";
export type { InvitedUser as SimpleInvitedUser } from "./SimpleUserSearch";

export { ScrollToTopButton } from "./ScrollToTopButton";
export { ScrollRestoration } from "./ScrollRestoration";

// Signature components
export { default as SignaturePad } from "./SignaturePad";
