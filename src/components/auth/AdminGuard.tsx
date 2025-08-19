import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loaders";

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * AdminGuard component to protect admin-only routes
 * Redirects to unauthorized page if user is not Admin
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading className="w-full max-w-md" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{
          from: location,
          redirectReason: "authentication_required",
          timestamp: Date.now(),
        }}
        replace
      />
    );
  }

  // Check if user has Admin role
  if (user?.role !== UserRole.ADMIN) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: "Access denied: Admin role required",
          from: location.pathname,
          userRole: user?.role,
          timestamp: Date.now(),
        }}
        replace
      />
    );
  }

  // Render children if authenticated and has Admin role
  return <>{children}</>;
};

export default AdminGuard;
