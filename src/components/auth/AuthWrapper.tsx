import React, { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loaders";

interface AuthWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * AuthWrapper component for pages that need authentication checking
 * but don't use the full AuthGuard functionality.
 * Redirects to login page if user is not authenticated.
 */
const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  fallback,
  redirectTo = "/auth/login" 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { 
        state: { from: location }, 
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location]);

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <Loading className="w-full max-w-md" />
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthWrapper;
