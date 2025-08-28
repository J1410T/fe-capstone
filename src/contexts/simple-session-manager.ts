/**
 * Simple Session Management Utility
 * Handles basic session timeout and auth-response management using encrypted cookies
 */

import { UserRole } from "@/contexts/auth-types";
import { AuthResponse } from "@/types/auth";
import {
  getAccessToken,
  setAccessToken,
  getAuthResponse,
  setAuthResponse,
  setLastActivity,
  clearAuthCookies,
  getLastActivity,
} from "@/utils/cookie-manager";

// Session configuration
const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT: 90 * 60 * 1000,
  CHECK_INTERVAL: 60 * 1000,
} as const;

export class SimpleSessionManager {
  private static instance: SimpleSessionManager;
  private checkTimer: NodeJS.Timeout | null = null;
  private isActive = false;
  private onLogoutCallback?: () => void;
  private onAuthResponseLostCallback?: () => void;

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
   * Initialize session manager with callbacks (no longer needs query client)
   */
  public initialize(callbacks: {
    onLogout?: () => void;
    onAuthResponseLost?: () => void;
  }) {
    this.onLogoutCallback = callbacks.onLogout;
    this.onAuthResponseLostCallback = callbacks.onAuthResponseLost;
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
    // Store in encrypted cookie instead of React Query cache
    setLastActivity(now);
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
   * Get access token from encrypted cookie
   */
  public getAccessToken(): string | null {
    try {
      return getAccessToken();
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }

  /**
   * Set access token in encrypted cookie
   */
  public setAccessToken(token: string): void {
    try {
      setAccessToken(token);
    } catch (error) {
      console.error("Error setting access token:", error);
    }
  }

  /**
   * Get auth-response data from encrypted cookie
   */
  public getAuthResponseData(): AuthResponse | null {
    try {
      return getAuthResponse<AuthResponse>();
    } catch (error) {
      console.error("Error getting auth-response data:", error);
      return null;
    }
  }

  /**
   * Set auth-response data in encrypted cookie
   */
  public setAuthResponseData(authResponse: AuthResponse): void {
    try {
      setAuthResponse(authResponse);
    } catch (error) {
      console.error("Error setting auth-response data:", error);
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
    // Clear encrypted cookies instead of React Query cache
    try {
      clearAuthCookies();
    } catch (error) {
      console.error("Error clearing auth cookies:", error);
    }

    this.endSession();
  }

  /**
   * Check if user has been inactive for too long
   */
  private checkInactivity(): boolean {
    try {
      const lastActivity = getLastActivity();
      if (!lastActivity) {
        return true; // No activity recorded, consider inactive
      }

      const timeSinceActivity = Date.now() - lastActivity;
      return timeSinceActivity >= SESSION_CONFIG.INACTIVITY_TIMEOUT;
    } catch (error) {
      console.error("Error checking stored inactivity:", error);
      return true; // On error, consider inactive for safety
    }
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

      // Only run session checks if we have both auth-response and access token
      // This prevents interference with unauthenticated flows like forgot password
      const hasAuthResponse = this.isAuthResponseValid();
      const hasAccessToken = !!this.getAccessToken();

      if (!hasAuthResponse && !hasAccessToken) {
        // No auth data at all - this is normal for unauthenticated flows
        return;
      }

      // Check if auth-response still exists when we expect it to
      if (hasAccessToken && !hasAuthResponse) {
        console.log("Auth-response no longer valid during session check");
        this.handleAuthResponseLoss();
        return;
      }

      // Check if access token still exists when we expect it to
      if (hasAuthResponse && !hasAccessToken) {
        console.log("Access token no longer exists during session check");
        this.clearSession();
        this.onLogoutCallback?.();
        return;
      }

      // Check for inactivity only if user is authenticated
      if (hasAuthResponse && hasAccessToken && this.checkInactivity()) {
        console.log("User inactive for 90 minutes - triggering auto-logout");
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
