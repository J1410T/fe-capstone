/**
 * Session timeout testing utilities
 * These functions can be used in the browser console to test session management
 */

import { simpleSessionManager } from "@/contexts/simple-session-manager";

export const sessionTestUtils = {
  /**
   * Manually clear the query cache to simulate session timeout
   */
  clearAuthData: () => {
    console.log("Manually clearing auth data to test session timeout...");
    simpleSessionManager.clearSession();
  },

  /**
   * Check current session status
   */
  checkSessionStatus: () => {
    const token = simpleSessionManager.getAccessToken();
    const authResponse = simpleSessionManager.isAuthResponseValid();
    const userRole = simpleSessionManager.getUserRoleFromAuthResponse();
    
    console.log("Session Status:", {
      hasToken: !!token,
      hasValidAuthResponse: authResponse,
      userRole: userRole,
      token: token ? "***" + token.slice(-10) : null
    });
    
    return {
      hasToken: !!token,
      hasValidAuthResponse: authResponse,
      userRole: userRole
    };
  },

  /**
   * Simulate inactivity by setting last activity to old timestamp
   */
  simulateInactivity: () => {
    console.log("Simulating user inactivity...");
    // Set last activity to 16 minutes ago (beyond the 15-minute timeout)
    const oldTimestamp = Date.now() - (16 * 60 * 1000);
    
    // We need access to the query client to do this
    // This would need to be called from a component that has access to useQueryClient
    console.log("Note: This needs to be called from a component with query client access");
    console.log("Use: queryClient.setQueryData(['last-activity'], " + oldTimestamp + ")");
  },

  /**
   * Get instructions for manual testing
   */
  getTestInstructions: () => {
    console.log(`
Session Timeout Testing Instructions:

1. Login to the application
2. Navigate to any protected page
3. Open browser console and run:
   - sessionTestUtils.checkSessionStatus() // Check current status
   - sessionTestUtils.clearAuthData() // Simulate cache clearing
   
4. The page should redirect to login automatically

5. To test inactivity timeout:
   - Login again
   - In a component with query client access, run:
     queryClient.setQueryData(['last-activity'], Date.now() - (16 * 60 * 1000))
   - Wait for the next session check (30 seconds max)
   - Should automatically logout and redirect

6. Test different pages:
   - /home
   - /staff/dashboard (if staff user)
   - /unauthorized
   - /some-non-existent-page (404)
   - All should redirect to login when auth data is cleared
    `);
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).sessionTestUtils = sessionTestUtils;
}
