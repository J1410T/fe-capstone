/**
 * Simple Session Management Utility
 * Handles basic session timeout and auth-response management
 */

import { UserRole } from "@/contexts/auth-types";
import { AuthResponse } from "@/types/auth";
import { QueryClient } from "@tanstack/react-query";

// Session configuration
const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT: 15 * 60 * 1000, // 15 minutes in milliseconds
  CHECK_INTERVAL: 30 * 1000, // Check every 30 seconds for more responsive detection
  STORAGE_KEYS: {
    AUTH_RESPONSE: "auth-response",
    LAST_ACTIVITY: "last-activity",
    ACCESS_TOKEN: "accessToken",
  },
} as const;

export class SimpleSessionManager {
  private static instance: SimpleSessionManager;
  private checkTimer: NodeJS.Timeout | null = null;
  private isActive = false;
  private onLogoutCallback?: () => void;
  private onAuthResponseLostCallback?: () => void;
  private queryClient?: QueryClient;

  private constructor() {
    this.updateLastActivity();
  }

  public static getInstance(): SimpleSessionManager {
    if (!SimpleSessionManager.instance) {
      SimpleSessionManager.instance = new SimpleSessionManager();
    }
    return SimpleSessionManager.instance;
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
    this.startSessionCheck();
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
    this.stopSessionCheck();
    console.log("Session ended");
  }

  /**
   * Update last activity timestamp
   */
  public updateLastActivity() {
    const now = Date.now();
    // Store in React Query cache instead of localStorage
    if (this.queryClient) {
      this.queryClient.setQueryData(["last-activity"], now);
    }
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
   * Get access token from React Query cache
   */
  public getAccessToken(): string | null {
    try {
      if (this.queryClient) {
        return this.queryClient.getQueryData<string>(["access-token"]) || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }

  /**
   * Set access token in React Query cache
   */
  public setAccessToken(token: string): void {
    try {
      if (this.queryClient) {
        this.queryClient.setQueryData(["access-token"], token);
      }
    } catch (error) {
      console.error("Error setting access token:", error);
    }
  }

  /**
   * Get auth-response data from query client
   */
  public getAuthResponseData(): AuthResponse | null {
    try {
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
    console.log("Clearing session data...");
    // Clear React Query cache only (no localStorage)
    try {
      if (this.queryClient) {
        this.queryClient.removeQueries({ queryKey: ["auth-response"] });
        this.queryClient.removeQueries({ queryKey: ["last-activity"] });
        this.queryClient.removeQueries({ queryKey: ["access-token"] });
        this.queryClient.removeQueries({ queryKey: ["auth-user"] });

        // Force invalidate all queries to ensure fresh state
        this.queryClient.invalidateQueries();
      }
    } catch (error) {
      console.error("Error clearing query cache:", error);
    }

    this.endSession();
  }

  /**
   * Check if user has been inactive for too long
   */
  private checkInactivity(): boolean {
    // Get last activity from React Query cache instead of localStorage
    const lastActivity = this.queryClient?.getQueryData<number>([
      "last-activity",
    ]);
    if (!lastActivity) {
      return true; // No activity recorded, consider inactive
    }

    const timeSinceActivity = Date.now() - lastActivity;

    return timeSinceActivity >= SESSION_CONFIG.INACTIVITY_TIMEOUT;
  }

  /**
   * Start periodic session checks
   */
  private startSessionCheck() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }

    this.checkTimer = setInterval(() => {
      if (!this.isActive) return;

      // Check if auth-response still exists
      if (!this.isAuthResponseValid()) {
        console.log("Auth-response no longer valid during session check");
        this.handleAuthResponseLoss();
        return;
      }

      // Check if access token still exists
      const token = this.getAccessToken();
      if (!token) {
        console.log("Access token no longer exists during session check");
        this.clearSession();
        this.onLogoutCallback?.();
        return;
      }

      // Check for inactivity
      if (this.checkInactivity()) {
        console.log("User inactive for 15 minutes - triggering auto-logout");
        this.clearSession();
        this.onLogoutCallback?.();
      }
    }, SESSION_CONFIG.CHECK_INTERVAL);
  }

  /**
   * Stop session checks
   */
  private stopSessionCheck() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  /**
   * Cleanup - remove timers
   */
  public cleanup() {
    this.stopSessionCheck();
    this.isActive = false;
  }
}

// Export singleton instance
export const simpleSessionManager = SimpleSessionManager.getInstance();

/**
 * Simple hook for basic session management
 */
export const useSimpleSession = () => {
  const updateActivity = () => {
    simpleSessionManager.updateLastActivity();
  };

  const isSessionValid = () => {
    return simpleSessionManager.isAuthResponseValid();
  };

  const getUserRole = () => {
    return simpleSessionManager.getUserRoleFromAuthResponse();
  };

  return {
    updateActivity,
    isSessionValid,
    getUserRole,
  };
};
