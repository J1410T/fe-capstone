import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

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
    return <div>Loading...</div>;
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

  // Redirect staff users to staff dashboard if they try to access regular dashboard
  if (user?.role === UserRole.STAFF && location.pathname === "/dashboard") {
    return <Navigate to="/staff/dashboard" replace />;
  }

  // Redirect Host Institution users to host dashboard if they try to access regular dashboard
  if (
    user?.role === UserRole.HOST_INSTITUTION &&
    location.pathname === "/dashboard"
  ) {
    return <Navigate to="/host/dashboard" replace />;
  }

<<<<<<< HEAD
  // Redirect non-staff users to member home if they try to access staff dashboard
=======
  // Redirect non-staff users to regular dashboard if they try to access staff dashboard
>>>>>>> 69eed2b5ec2e219415f2d4e947ea0e522f30c4d6
  if (user?.role !== UserRole.STAFF && location.pathname.startsWith("/staff")) {
    return <Navigate to="/member/home" replace />;
  }

  // Redirect non-host users to regular dashboard if they try to access host dashboard
  if (
    user?.role !== UserRole.HOST_INSTITUTION &&
    location.pathname.startsWith("/host")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect non-host users to regular dashboard if they try to access host dashboard
  if (
    user?.role !== UserRole.HOST_INSTITUTION &&
    location.pathname.startsWith("/host")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};

export default AuthGuard;
