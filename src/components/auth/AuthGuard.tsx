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
    // Add navigation tracking metadata
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

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <Navigate
          to="/unauthorized"
          state={{
            reason: "Insufficient permissions",
            from: location.pathname,
            requiredRoles,
            userRole: user.role,
            timestamp: Date.now(),
          }}
          replace
        />
      );
    }
  }

  // Redirect to role-specific pages if accessing the generic dashboard
  if (location.pathname === "/dashboard") {
    if (user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN) {
      return <Navigate to="/staff/dashboard" replace />;
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      return <Navigate to="/host/dashboard" replace />;
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Redirect to home page if accessing the root path
  if (location.pathname === "/") {
    if (user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN) {
      return <Navigate to="/staff/dashboard" replace />;
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Redirect non-staff/admin users to unauthorized if they try to access staff routes
  if (
    user?.role !== UserRole.STAFF &&
    user?.role !== UserRole.ADMIN &&
    location.pathname.startsWith("/staff")
  ) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: "Access denied: Staff or Admin role required",
          from: location.pathname,
          userRole: user?.role,
          timestamp: Date.now(),
        }}
        replace
      />
    );
  }

  // Redirect staff/admin users to admin dashboard if they try to access RESEARCHER home
  if (
    (user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN) &&
    location.pathname === "/home"
  ) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  // Redirect non-host users to unauthorized if they try to access host routes
  if (
    user?.role !== UserRole.HOST_INSTITUTION &&
    location.pathname.startsWith("/host")
  ) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: "Access denied: Host Institution role required",
          from: location.pathname,
          userRole: user?.role,
          timestamp: Date.now(),
        }}
        replace
      />
    );
  }

  // Redirect non-PI users to unauthorized if they try to access PI routes
  if (
    user?.role !== UserRole.PRINCIPAL_INVESTIGATOR &&
    location.pathname.startsWith("/pi")
  ) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: "Access denied: Principal Investigator role required",
          from: location.pathname,
          userRole: user?.role,
          timestamp: Date.now(),
        }}
        replace
      />
    );
  }

  // Redirect non-council users to unauthorized if they try to access council routes
  if (
    user?.role !== UserRole.APPRAISAL_COUNCIL &&
    location.pathname.startsWith("/council")
  ) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: "Access denied: Appraisal Council role required",
          from: location.pathname,
          userRole: user?.role,
          timestamp: Date.now(),
        }}
        replace
      />
    );
  }

  // Redirect non-RESEARCHER users to unauthorized page if they try to access RESEARCHER routes
  if (
    user?.role !== UserRole.RESEARCHER &&
    location.pathname.startsWith("/researcher")
  ) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          reason: "Access denied: Researcher role required",
          from: location.pathname,
          userRole: user?.role,
          timestamp: Date.now(),
        }}
        replace
      />
    );
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};

export default AuthGuard;
