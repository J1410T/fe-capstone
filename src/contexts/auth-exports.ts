// Main auth exports - import from this file for all auth-related items
export type { User } from "./auth-types";
export { UserRole } from "./auth-types";
export { useAuth } from "./auth-hooks";
export { AuthProvider } from "./AuthContext";

// For backward compatibility, also export buttonVariants and useSidebar
export { buttonVariants } from "../components/ui/button-variants";
export { useSidebar } from "../components/ui/sidebar-hooks";
