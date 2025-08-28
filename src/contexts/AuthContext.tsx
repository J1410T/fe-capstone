import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { UserRole, User, JwtPayload } from "./auth-types";
import { AuthContext } from "./auth-context";
import { AuthResponse } from "@/types/auth";
import { simpleSessionManager } from "@/contexts/simple-session-manager";
import { getAuthResponse, setAuthResponse } from "@/utils/cookie-manager";

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

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Logout function
  const logout = useCallback(() => {
    // Clear user and session
    setUser(null);
    simpleSessionManager.clearSession();
    toast.success("Logged out successfully");
    navigate("/auth/login");
  }, [navigate]);

  // Simple activity tracking with native events
  useEffect(() => {
    if (!isAuthenticated) return;

    let activityTimeout: NodeJS.Timeout;
    let lastActivityTime = Date.now();

    const updateActivity = () => {
      lastActivityTime = Date.now();
      simpleSessionManager.updateLastActivity();

      // Clear existing timeout
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }

      // Set new timeout for 10 minutes
      activityTimeout = setTimeout(() => {
        const timeSinceActivity = Date.now() - lastActivityTime;
        if (timeSinceActivity >= 10 * 60 * 1000) {
          // 10 minutes
          console.log("User idle - triggering automatic logout");
          toast.info("You have been logged out due to inactivity");
          logout();
        }
      }, 10 * 60 * 1000); // 10 minutes
    };

    // Activity events
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Throttled event handler
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledUpdateActivity = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 30000); // Update at most once every 30 seconds
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, throttledUpdateActivity, {
        passive: true,
      });
    });

    // Page visibility handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // console.log("User left the page");
        console.log();
      } else {
        // console.log("User returned to page");
        console.log();
        updateActivity();
      }
    };

    // Note: Removed beforeunload logout handler as it was causing users to be logged out
    // on page refresh. The session should persist across page refreshes and only
    // timeout due to actual inactivity.

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial activity update
    updateActivity();

    // Cleanup
    return () => {
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }

      events.forEach((event) => {
        document.removeEventListener(event, throttledUpdateActivity);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, logout]);

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

        // Check for existing token in React Query cache
        const token = simpleSessionManager.getAccessToken();
        if (token) {
          // Validate token and set user with role from auth-response
          const { success } = await validateAndSetUser(token, userRole);
          if (!success) {
            // Clear invalid token and session g
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
      // Clear token from React Query cache instead of localStorage
      simpleSessionManager.setAccessToken("");
      return {
        success: false,
        userRole: null,
      };
    }
  };

  // Login function
  const login = async (accessToken: string) => {
    try {
      // Save token to React Query cache instead of localStorage
      simpleSessionManager.setAccessToken(accessToken);

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
        if (userRole === UserRole.STAFF || userRole === UserRole.ADMIN) {
          // Staff and Admin users go to staff index page
          navigate("/staff");
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

  // Initialize session manager (moved to after logout definition)
  useEffect(() => {
    simpleSessionManager.initialize({
      onLogout: () => {
        console.log("Session manager triggered logout");
        logout();
      },
      onAuthResponseLost: () => {
        // Only redirect if user was previously authenticated
        // Don't redirect during unauthenticated flows like forgot password
        if (isAuthenticated) {
          console.log("Auth-response lost - redirecting to login");
          setUser(null);
          navigate("/auth/login");
        }
      },
    });

    return () => {
      simpleSessionManager.cleanup();
    };
  }, [navigate, logout, isAuthenticated]);

  // Note: Query cache monitoring removed since we're using cookies now

  // Check if user has specific role
  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  // Switch user role
  const switchRole = async (newRole: UserRole): Promise<boolean> => {
    if (!user) return false;

    try {
      // Get current auth-response data from encrypted cookie
      const authResponse = getAuthResponse<AuthResponse>();
      if (!authResponse) {
        throw new Error("No auth response data found");
      }

      // Check if the new role is available in the user's roles
      if (!authResponse.roles.includes(newRole)) {
        throw new Error(`Role ${newRole} is not available for this user`);
      }

      // Call the API to switch role - this will be handled by the RoleSwitcher component
      // using the useSetMyRole mutation hook
      // For now, just update local state as fallback
      const updatedAuthResponse = {
        ...authResponse,
        "selected-role": newRole,
      };

      // Update the encrypted cookie
      setAuthResponse(updatedAuthResponse);

      // Update user role
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));

      // Reset session activity since role switch is a user action
      simpleSessionManager.updateLastActivity();

      return true;
    } catch (error) {
      console.error("Failed to switch role:", error);
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
