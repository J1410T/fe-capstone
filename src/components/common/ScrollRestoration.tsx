import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollRestoration component
 * Automatically scrolls to top when route changes
 * Should be placed in the main layout or App component
 */
export const ScrollRestoration: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top immediately when location changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};
