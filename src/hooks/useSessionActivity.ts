/**
 * Custom hook for session activity tracking
 * Monitors user activity and manages session state
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { sessionManager } from "@/contexts/session-manager";
import { queryClient } from "@/lib/react-query";

interface UseSessionActivityOptions {
  /**
   * Whether to enable activity tracking
   * @default true
   */
  enabled?: boolean;

  /**
   * Custom callback when user becomes inactive
   */
  onInactive?: () => void;

  /**
   * Custom callback when user becomes active
   */
  onActive?: () => void;

  /**
   * Debounce time for activity events in milliseconds
   * @default 1000
   */
  debounceMs?: number;
}

// Remo ved unused interface - using individual state variables instead

/**
 * Hook for tracking user session activity
 */
export const useSessionActivity = (options: UseSessionActivityOptions = {}) => {
  const { enabled = true, onInactive, onActive, debounceMs = 1000 } = options;

  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date | null>(new Date());
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [timeUntilLogout, setTimeUntilLogout] = useState<number | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wasActiveRef = useRef(true);

  /**
   * Update activity state with debouncing
   */
  const updateActivity = useCallback(() => {
    if (!enabled) return;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      const now = new Date();

      setIsActive(true);
      setLastActivity(now);

      // Call onActive callback if user was previously inactive
      if (!wasActiveRef.current && onActive) {
        onActive();
      }

      wasActiveRef.current = true;
    }, debounceMs);
  }, [enabled, debounceMs, onActive]);

  /**
   * Handle visibility change
   */
  const handleVisibilityChange = useCallback(() => {
    const isVisible = !document.hidden;

    setIsTabVisible(isVisible);

    // If tab becomes visible, treat as activity
    if (isVisible && enabled) {
      updateActivity();
    }
  }, [enabled, updateActivity]);

  /**
   * Start countdown timer for logout
   */
  const startLogoutCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const startTime = Date.now();

    countdownTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, TIMEOUT_MS - elapsed);
      const remainingSeconds = Math.ceil(remaining / 1000);

      setTimeUntilLogout(remainingSeconds);

      // If countdown reaches zero, trigger inactivity
      if (remainingSeconds <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }

        setIsActive(false);
        setTimeUntilLogout(null);

        if (onInactive) {
          onInactive();
        }

        wasActiveRef.current = false;
      }
    }, 1000);
  }, [onInactive]);

  /**
   * Reset countdown timer
   */
  const resetLogoutCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    setTimeUntilLogout(null);
  };

  /**
   * Activity event handlers
   */
  useEffect(() => {
    if (!enabled) return;

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add activity listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [enabled, updateActivity, handleVisibilityChange]);

  /**
   * Monitor session manager state
   */
  useEffect(() => {
    if (!enabled) return;

    const checkSessionState = () => {
      // Check if auth-response is still valid
      if (!sessionManager.isAuthResponseValid()) {
        setIsActive(false);
        setTimeUntilLogout(null);
        return;
      }

      // Get last activity from React Query cache
      const lastActivityTime = queryClient.getQueryData([
        "last-activity",
      ]) as number;
      if (lastActivityTime) {
        const timeSinceActivity = Date.now() - lastActivityTime;
        const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

        if (timeSinceActivity >= TIMEOUT_MS) {
          // User has been inactive too long
          setIsActive(false);
          setTimeUntilLogout(null);

          if (onInactive) {
            onInactive();
          }
        } else {
          // Start countdown for remaining time
          const remaining = TIMEOUT_MS - timeSinceActivity;
          const remainingSeconds = Math.ceil(remaining / 1000);

          setTimeUntilLogout(remainingSeconds);

          startLogoutCountdown();
        }
      }
    };

    // Check session state on mount
    checkSessionState();

    // Set up periodic checks
    const intervalId = setInterval(checkSessionState, 30000); // Check every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, onInactive, startLogoutCountdown]);

  /**
   * Reset activity (useful for manual resets)
   */
  const resetActivity = useCallback(() => {
    updateActivity();
    resetLogoutCountdown();
  }, [updateActivity]);

  /**
   * Get formatted time until logout
   */
  const getFormattedTimeUntilLogout = (): string | null => {
    if (!timeUntilLogout) return null;

    const minutes = Math.floor(timeUntilLogout / 60);
    const seconds = timeUntilLogout % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    isActive,
    lastActivity,
    isTabVisible,
    timeUntilLogout,
    resetActivity,
    getFormattedTimeUntilLogout,
  };
};
