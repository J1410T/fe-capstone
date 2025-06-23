import React, { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { UserRole, User, JwtPayload } from "./auth-types";
import { AuthContext } from "./auth-context";

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

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Validate token and set user
          const { success } = await validateAndSetUser(token);
          if (!success) {
            // Clear invalid token
            localStorage.removeItem("accessToken");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid token
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Validate token and set user
  const validateAndSetUser = async (token: string) => {
    try {
      // Decode JWT token
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      // Set user
      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        role: decoded.role,
        accessToken: token,
      });

      return {
        success: true,
        userRole: decoded.role,
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

      // Validate token and set user
      const { success, userRole } = await validateAndSetUser(accessToken);

      if (success) {
        toast.success("Login successful");

        // Redirect users based on their role
        if (userRole === UserRole.STAFF) {
          // Staff users go to staff dashboard with sidebar
          navigate("/staff/dashboard");
        } else if (userRole === UserRole.PRINCIPAL_INVESTIGATOR) {
          // Principal Investigators go to home page
          navigate("/home");
        } else {
          // All other users go to member home page
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
    // Clear user and token
    setUser(null);
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully");
    navigate("/auth/login");
  };

  // Check if user has specific role
  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
