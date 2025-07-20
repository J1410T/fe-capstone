/**
 * Staff Pages barrel export
 * Centralized exports for all Staff interface components
 */

// Main Dashboard
export { default as StaffDashboard } from "./components/Dashboard";

// Document Forms Management
export { default as DocumentFormsManagement } from "./components/DocumentFormsManagement"; 

// Project Management
export { default as StaffProjectRegistration } from "./components/RegisterProject";
export { default as ProjectAssignments } from "./components/ApproveProject";

// Approvals
export { default as ProjectApprovals } from "./components/Approvals";

// Payment Management
export { default as PaymentManagement } from "./components/Transaction";

// User Management
export { default as UserAccessControl } from "./components/UsersManagement";

// Individual Management Pages
export { default as FieldsManagement } from "./components/FieldsManagement";
export { default as AppraisalCouncilsManagement } from "./components/AppraisalCouncilsManagement";
export { default as MajorsManagement } from "./components/MajorsManagement";
export { default as MilestonesManagement } from "./components/MilestonesManagement";
