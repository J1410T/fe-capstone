import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loaders";

interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

/**
 * AuthGuard component to protect routes
 * Redirects to login page if user is not authenticated
 * Redirects to unauthorized page if user doesn't have required role
 * Redirects staff users to staff dashboard if they try to access regular dashboard
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles }) => {
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
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Redirect to role-specific pages if accessing the generic dashboard
  if (location.pathname === "/dashboard") {
    if (user?.role === UserRole.STAFF) {
      return <Navigate to="/staff/dashboard" replace />;
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      return <Navigate to="/host/dashboard" replace />;
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      return <Navigate to="/pi/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Redirect to home page if accessing the root path
  if (location.pathname === "/") {
    if (user?.role === UserRole.STAFF) {
      return <Navigate to="/staff/dashboard" replace />;
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      return <Navigate to="/pi/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Redirect non-staff users to member home if they try to access staff dashboard
  if (user?.role !== UserRole.STAFF && location.pathname.startsWith("/staff")) {
    return <Navigate to="/home" replace />;
  }

  // Redirect staff users to admin dashboard if they try to access member home
  if (user?.role === UserRole.STAFF && location.pathname === "/home") {
    return <Navigate to="/staff/dashboard" replace />;
  }

  // Redirect non-host users to member home if they try to access host dashboard
  if (
    user?.role !== UserRole.HOST_INSTITUTION &&
    location.pathname.startsWith("/host")
  ) {
    return <Navigate to="/home" replace />;
  }

  // Redirect non-PI users to member home if they try to access PI dashboard
  if (
    user?.role !== UserRole.PRINCIPAL_INVESTIGATOR &&
    location.pathname.startsWith("/pi")
  ) {
    return <Navigate to="/home" replace />;
  }

  // Redirect non-member users to unauthorized page if they try to access member routes
  if (
    user?.role !== UserRole.MEMBER &&
    location.pathname.startsWith("/member")
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};

export default AuthGuard;
