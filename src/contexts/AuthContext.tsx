import React, { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UserRole, User, JwtPayload } from "./auth-types";
import { AuthContext } from "./auth-context";
import { GoogleAuthResponse } from "@/types/auth";
import { simpleSessionManager } from "@/contexts/simple-session-manager";

// Re-export for compatibility (but keep them in separate files for fast refresh)
export type { User } from "./auth-types";
export { UserRole } from "./auth-types";
export { useAuth } from "./auth-hooks";

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Initialize auth state from localStorage and auth-response
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // First check if auth-response exists and is valid
        if (!simpleSessionManager.isAuthResponseValid()) {
          console.log("No valid auth-response found during initialization");
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Get UserRole from auth-response
        const userRole = simpleSessionManager.getUserRoleFromAuthResponse();
        if (!userRole) {
          console.log("No valid UserRole found in auth-response");
          simpleSessionManager.clearSession();
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Check for existing token
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Validate token and set user with role from auth-response
          const { success } = await validateAndSetUser(token, userRole);
          if (!success) {
            // Clear invalid token and session
            simpleSessionManager.clearSession();
            setUser(null);
          } else {
            // Start session tracking
            simpleSessionManager.startSession();
          }
        } else {
          // No token but auth-response exists - clear everything
          simpleSessionManager.clearSession();
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid session
        simpleSessionManager.clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Validate token and set user with role from auth-response
  const validateAndSetUser = async (
    token: string,
    roleFromAuthResponse?: UserRole
  ) => {
    try {
      // Decode JWT token
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      // Use role from auth-response if provided, otherwise fall back to token role
      const userRole = roleFromAuthResponse || decoded.role;

      // Set user with role from auth-response
      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        role: userRole,
        accessToken: token,
      });

      return {
        success: true,
        userRole: userRole,
      };
    } catch (error) {
      console.error("Token validation failed:", error);
      setUser(null);
      localStorage.removeItem("accessToken");
      return {
        success: false,
        userRole: null,
      };
    }
  };

  // Login function
  const login = async (accessToken: string) => {
    try {
      // Save token to localStorage
      localStorage.setItem("accessToken", accessToken);

      // Get UserRole from auth-response (should be set by GoogleAuthentication component)
      const userRole = simpleSessionManager.getUserRoleFromAuthResponse();

      if (!userRole) {
        console.error("No valid UserRole found in auth-response during login");
        toast.error("Login failed - invalid role");
        return;
      }

      // Validate token and set user with role from auth-response
      const { success } = await validateAndSetUser(accessToken, userRole);

      if (success) {
        // Start session tracking
        simpleSessionManager.startSession();

        toast.success("Login successful");

        // Redirect users based on their role from auth-response
        if (userRole === UserRole.STAFF) {
          // Staff users go to staff dashboard with sidebar
          navigate("/staff/dashboard");
        } else if (userRole === UserRole.PRINCIPAL_INVESTIGATOR) {
          // Principal Investigators go to home page
          navigate("/home");
        } else {
          // All other users go to RESEARCHER home page
          navigate("/home");
        }
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    }
  };

  // Logout function
  const logout = () => {
    // Clear user and session
    setUser(null);
    simpleSessionManager.clearSession();
    toast.success("Logged out successfully");
    navigate("/auth/login");
  };

  // Initialize session manager
  useEffect(() => {
    simpleSessionManager.initialize({
      onLogout: () => {
        console.log("Session manager triggered logout");
        logout();
      },
      onAuthResponseLost: () => {
        console.log("Auth-response lost - redirecting to login");
        setUser(null);
        navigate("/auth/login");
      },
      queryClient: queryClient,
    });

    return () => {
      simpleSessionManager.cleanup();
    };
  }, [navigate, queryClient, logout]);

  // Check if user has specific role
  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  // Switch user role
  const switchRole = async (newRole: UserRole): Promise<boolean> => {
    if (!user) return false;

    try {
      // Get current auth-response data
      const authResponse = queryClient.getQueryData<GoogleAuthResponse>([
        "auth-response",
      ]);
      if (!authResponse) {
        throw new Error("No auth response data found");
      }

      // Check if the new role is available in the user's roles
      if (!authResponse.roles.includes(newRole)) {
        throw new Error(`Role ${newRole} is not available for this user`);
      }

      // Update the auth-response data with new selected role
      const updatedAuthResponse = {
        ...authResponse,
        "selected-role": newRole,
      };

      // Update the query cache
      queryClient.setQueryData<GoogleAuthResponse>(
        ["auth-response"],
        updatedAuthResponse
      );

      // Update user role
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));

      // Reset session activity since role switch is a user action
      simpleSessionManager.updateLastActivity();

      // Show success notification
      toast.success(`Switched to ${newRole} role`);

      return true;
    } catch (error) {
      console.error("Failed to switch role:", error);
      toast.error("Failed to switch role");
      return false;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
