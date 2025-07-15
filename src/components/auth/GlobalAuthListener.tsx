import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Global authentication listener component
 * Monitors authentication state and redirects to login when needed
 * This component should be placed at the root level of the app
 */
const GlobalAuthListener: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading or already on auth pages
    if (isLoading || location.pathname.startsWith('/auth/')) {
      return;
    }

    // If not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated) {
      console.log("GlobalAuthListener: User not authenticated, redirecting to login");
      navigate("/auth/login", { 
        state: { from: location }, 
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // This component doesn't render anything
  return null;
};

export default GlobalAuthListener;
