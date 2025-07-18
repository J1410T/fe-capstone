import { useContext } from "react";
import { AuthContext } from "./auth-context";

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Instead of throwing an error, return a default context
    // This prevents crashes when auth components are rendered outside of AuthProvider
    console.warn(
      "useAuth is being used outside of an AuthProvider. Using default values."
    );
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: () => {},
      logout: () => {},
      hasRole: () => false,
      switchRole: async () => false,
    };
  }
  return context;
};
