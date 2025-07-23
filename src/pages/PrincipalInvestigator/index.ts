// Principal Investigator Pages
export { default as ProjectRegistration } from "./ProjectRegistration";
export { default as MyProjects } from "./MyProjects";

// Default export (MyProjects as main page)
export { default } from "./MyProjects";

// Shared components and utilities
export * from "./shared/types";
export * from "./shared/utils";
// StatusBadge should be imported directly from @/components/common/StatusBadge
