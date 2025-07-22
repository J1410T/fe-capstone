import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationHistoryEntry {
  pathname: string;
  timestamp: number;
  isRedirect: boolean;
  userRole: string | null;
}

/**
 * NavigationGuard component to monitor navigation patterns and detect unauthorized access
 * Tracks redirect chains and returns unauthorized when navigating between redirects
 */
const NavigationGuard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navigationHistory = useRef<NavigationHistoryEntry[]>([]);
  const lastLocationRef = useRef<string>("");
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Routes that are considered redirects
  const redirectRoutes = [
    "/",
    "/dashboard",
    "/home",
    "/staff/dashboard",
    "/host/dashboard",
    "/pi/dashboard",
    "/council/dashboard",
    "/researcher/dashboard",
  ];

  // Role-specific route patterns
  const roleRoutePatterns = {
    STAFF: ["/staff"],
    HOST_INSTITUTION: ["/host"],
    PRINCIPAL_INVESTIGATOR: ["/pi"],
    APPRAISAL_COUNCIL: ["/council"],
    RESEARCHER: ["/researcher"],
  };

  // Routes that should be accessible without strict redirect checking
  const publicRoutes = [
    "/auth/login",
    "/auth/login-staff",
    "/unauthorized",
    "/auth",
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentTime = Date.now();
    const isCurrentRedirect = redirectRoutes.includes(currentPath);
    const isPublicRoute = publicRoutes.some((route) =>
      currentPath.startsWith(route)
    );

    // Skip tracking for public routes or if user is not authenticated yet
    if (isPublicRoute || !user || !isAuthenticated) {
      return;
    }

    // Add current navigation to history
    const newEntry: NavigationHistoryEntry = {
      pathname: currentPath,
      timestamp: currentTime,
      isRedirect: isCurrentRedirect,
      userRole: user?.role || null,
    };

    navigationHistory.current.push(newEntry);

    // Keep only last 10 entries to prevent memory issues
    if (navigationHistory.current.length > 10) {
      navigationHistory.current = navigationHistory.current.slice(-10);
    }

    // Clear any existing timeout
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    // Check for unauthorized route access patterns
    const checkUnauthorizedPattern = () => {
      const history = navigationHistory.current;
      const recentEntries = history.filter(
        (entry) => currentTime - entry.timestamp < 5000 // Last 5 seconds
      );

      // Skip checks if this is the first navigation, a page reload, or user is accessing their authorized routes
      const isFirstNavigation = history.length <= 1;
      const isPageReload =
        lastLocationRef.current === "" ||
        lastLocationRef.current === currentPath;

      // Check if user is accessing a route they're authorized for
      const userRolePatterns =
        roleRoutePatterns[user?.role as keyof typeof roleRoutePatterns] || [];
      const isAccessingAuthorizedRoute = userRolePatterns.some((pattern) =>
        currentPath.startsWith(pattern)
      );

      if (isFirstNavigation || isPageReload || isAccessingAuthorizedRoute) {
        console.log(
          "NavigationGuard: Skipping checks - first navigation, page reload, or authorized route access"
        );
        return;
      }

      // Pattern 1: Direct unauthorized role-based route access (only for cross-role navigation)
      if (user?.role && isAuthenticated && history.length > 1) {
        const previousEntry = history[history.length - 2];

        // Only check if there was a previous navigation from a different role's route
        if (previousEntry) {
          const previousRoleRoute = Object.entries(roleRoutePatterns).find(
            ([role, patterns]) =>
              patterns.some((pattern) =>
                previousEntry.pathname.startsWith(pattern)
              )
          );

          const currentRoleRoute = Object.entries(roleRoutePatterns).find(
            ([role, patterns]) =>
              patterns.some((pattern) => currentPath.startsWith(pattern))
          );

          // Only trigger if navigating from one role's route to another role's route
          if (
            previousRoleRoute &&
            currentRoleRoute &&
            previousRoleRoute[0] !== currentRoleRoute[0] &&
            currentRoleRoute[0] !== user.role
          ) {
            console.warn(
              `NavigationGuard: Cross-role navigation detected - ${user.role} user navigating from ${previousRoleRoute[0]} route to ${currentRoleRoute[0]} route`
            );
            handleUnauthorizedAccess(
              `Access denied: ${user.role} role cannot access ${currentRoleRoute[0]} routes`
            );
            return;
          }
        }
      }

      // Pattern 2: Multiple redirects in quick succession (potential redirect loop)
      const recentRedirects = recentEntries.filter((entry) => entry.isRedirect);
      if (recentRedirects.length >= 3) {
        console.warn(
          "NavigationGuard: Multiple redirects detected, checking authorization"
        );
        handleUnauthorizedAccess("Multiple redirects detected");
        return;
      }

      // Pattern 3: Accessing redirect route after another redirect without proper authorization
      if (recentEntries.length >= 2 && isCurrentRedirect) {
        const previousEntry = recentEntries[recentEntries.length - 2];

        // If previous was also a redirect and user role changed or is inconsistent
        if (
          previousEntry.isRedirect &&
          (previousEntry.userRole !== user?.role || !isAuthenticated)
        ) {
          console.warn("NavigationGuard: Unauthorized redirect chain detected");
          handleUnauthorizedAccess("Unauthorized redirect chain");
          return;
        }
      }

      // Pattern 4: Rapid navigation between different role-specific routes
      const roleSpecificRoutes = recentEntries.filter(
        (entry) =>
          entry.pathname.startsWith("/staff/") ||
          entry.pathname.startsWith("/host/") ||
          entry.pathname.startsWith("/pi/") ||
          entry.pathname.startsWith("/council/") ||
          entry.pathname.startsWith("/researcher/")
      );

      if (roleSpecificRoutes.length >= 2) {
        const differentRoleRoutes = new Set(
          roleSpecificRoutes.map((entry) => entry.pathname.split("/")[1])
        );

        if (differentRoleRoutes.size > 1) {
          console.warn("NavigationGuard: Cross-role navigation detected");
          handleUnauthorizedAccess("Cross-role navigation detected");
          return;
        }
      }

      // Pattern 5: Accessing protected route without proper authentication state
      if (!isAuthenticated && !isPublicRoute && !isCurrentRedirect) {
        console.warn(
          "NavigationGuard: Unauthenticated access to protected route"
        );
        handleUnauthorizedAccess("Unauthenticated access");
        return;
      }
    };

    // Set a longer delay to allow for legitimate redirects and auth state to stabilize
    redirectTimeoutRef.current = setTimeout(checkUnauthorizedPattern, 500);

    // Update last location
    lastLocationRef.current = currentPath;

    // Cleanup function
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [location.pathname, user?.role, isAuthenticated]);

  const handleUnauthorizedAccess = (reason: string) => {
    console.error(`NavigationGuard: Unauthorized access detected - ${reason}`);

    // Clear navigation history to prevent further issues
    navigationHistory.current = [];

    // Navigate to unauthorized page
    navigate("/unauthorized", {
      replace: true,
      state: {
        reason,
        from: location.pathname,
        timestamp: Date.now(),
      },
    });
  };

  // Log navigation history for debugging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("NavigationGuard History:", navigationHistory.current);
    }
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};

export default NavigationGuard;
