/**
 * Session Management Utility
 * Handles user activity tracking, auto-logout, and session preservation
 */

import { UserRole } from "@/contexts/auth-types";
import { AuthResponse } from "@/types/auth";
import { QueryClient } from "@tanstack/react-query";

// Session configuration
const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT: 2 * 60 * 1000, // 15 minutes in milliseconds
  ACTIVITY_CHECK_INTERVAL: 30 * 1000, // Check every 30 seconds
  STORAGE_KEYS: {
    AUTH_RESPONSE: "auth-response",
    LAST_ACTIVITY: "last-activity",
    ACCESS_TOKEN: "accessToken",
  },
} as const;

// Activity events to track
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
] as const;

export class SessionManager {
  private static instance: SessionManager;
  private activityTimer: NodeJS.Timeout | null = null;
  private checkTimer: NodeJS.Timeout | null = null;
  private isActive = false;
  private onLogoutCallback?: () => void;
  private onAuthResponseLostCallback?: () => void;
  private queryClient?: QueryClient;

  private constructor() {
    this.updateLastActivity();
    this.setupActivityListeners();
    this.setupVisibilityListener();
    this.startActivityCheck();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Initialize session manager with callbacks and query client
   */
  public initialize(callbacks: {
    onLogout?: () => void;
    onAuthResponseLost?: () => void;
    queryClient?: QueryClient;
  }) {
    this.onLogoutCallback = callbacks.onLogout;
    this.onAuthResponseLostCallback = callbacks.onAuthResponseLost;
    this.queryClient = callbacks.queryClient;
    this.isActive = true;
  }

  /**
   * Start the session (called after successful login)
   */
  public startSession() {
    this.updateLastActivity();
    this.isActive = true;
    console.log("Session started");
  }

  /**
   * End the session (called during logout)
   */
  public endSession() {
    this.isActive = false;
    this.clearActivityTimer();
    console.log("Session ended");
  }

  /**
   * Get UserRole from auth-response data
   */
  public getUserRoleFromAuthResponse(): UserRole | null {
    try {
      const authResponseData = this.getAuthResponseData();
      if (!authResponseData) {
        return null;
      }

      const selectedRole = authResponseData["selected-role"];

      // Validate that the selected role is a valid UserRole
      if (Object.values(UserRole).includes(selectedRole as UserRole)) {
        return selectedRole as UserRole;
      }

      console.warn("Invalid selected-role in auth-response:", selectedRole);
      return null;
    } catch (error) {
      console.error("Error getting UserRole from auth-response:", error);
      return null;
    }
  }

  /**
   * Get auth-response data from query client only (no localStorage fallback)
   */
  public getAuthResponseData(): AuthResponse | null {
    try {
      // Get from React Query cache only
      if (this.queryClient) {
        const cachedData = this.queryClient.getQueryData<AuthResponse>([
          "auth-response",
        ]);
        if (cachedData) {
          return cachedData;
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting auth-response data:", error);
      return null;
    }
  }

  /**
   * Check if auth-response exists and is valid
   */
  public isAuthResponseValid(): boolean {
    const authResponse = this.getAuthResponseData();
    return authResponse !== null && authResponse["selected-role"] !== undefined;
  }

  /**
   * Handle auth-response loss/deletion
   */
  public handleAuthResponseLoss() {
    console.log("Auth-response lost - triggering logout");
    this.clearSession();
    this.onAuthResponseLostCallback?.();
  }

  /**
   * Clear all session data
   */
  public clearSession() {
    // Clear React Query cache only (no localStorage)
    try {
      if (this.queryClient) {
        this.queryClient.removeQueries({ queryKey: ["auth-response"] });
        this.queryClient.removeQueries({ queryKey: ["last-activity"] });
        this.queryClient.removeQueries({ queryKey: ["access-token"] });
      }
    } catch (error) {
      console.error("Error clearing query cache:", error);
    }

    this.endSession();
  }

  /**
   * Update last activity timestamp
   */
  private updateLastActivity() {
    const now = Date.now();
    // Store in React Query cache instead of localStorage
    if (this.queryClient) {
      this.queryClient.setQueryData(["last-activity"], now);
    }
    this.resetActivityTimer();
  }

  /**
   * Setup activity event listeners
   */
  private setupActivityListeners() {
    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, this.handleActivity, { passive: true });
    });
  }

  /**
   * Setup page visibility listener
   */
  private setupVisibilityListener() {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isActive) {
        // User returned to tab - update activity
        this.updateLastActivity();
      }
    });
  }

  /**
   * Handle user activity
   */
  private handleActivity = () => {
    if (this.isActive) {
      this.updateLastActivity();
    }
  };

  /**
   * Reset the activity timer
   */
  private resetActivityTimer() {
    this.clearActivityTimer();

    if (this.isActive) {
      this.activityTimer = setTimeout(() => {
        this.handleInactivityTimeout();
      }, SESSION_CONFIG.INACTIVITY_TIMEOUT);
    }
  }

  /**
   * Clear the activity timer
   */
  private clearActivityTimer() {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  /**
   * Handle inactivity timeout
   */
  private handleInactivityTimeout() {
    console.log("User inactive for 15 minutes - triggering auto-logout");
    this.clearSession();
    this.onLogoutCallback?.();
  }

  /**
   * Start periodic activity check
   */
  private startActivityCheck() {
    this.checkTimer = setInterval(() => {
      if (!this.isActive) return;

      // Check if auth-response still exists
      if (!this.isAuthResponseValid()) {
        this.handleAuthResponseLoss();
        return;
      }

      // Check for inactivity
      const lastActivity = this.queryClient?.getQueryData<number>([
        "last-activity",
      ]);
      if (lastActivity) {
        const timeSinceActivity = Date.now() - lastActivity;
        if (timeSinceActivity >= SESSION_CONFIG.INACTIVITY_TIMEOUT) {
          this.handleInactivityTimeout();
        }
      }
    }, SESSION_CONFIG.ACTIVITY_CHECK_INTERVAL);
  }

  /**
   * Cleanup - remove event listeners and timers
   */
  public cleanup() {
    // Remove activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      document.removeEventListener(event, this.handleActivity);
    });

    // Clear timers
    this.clearActivityTimer();
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }

    this.isActive = false;
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();
