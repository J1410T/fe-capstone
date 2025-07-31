import FlexibleHeader from "@/components/layout/header";
import { Outlet, useLocation } from "react-router-dom";
import AuthGuard from "@/components/auth/AuthGuard";
import { useSimpleSession } from "@/contexts/simple-session-manager";
import { useEffect } from "react";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";

function UserLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  const isTasksPage = location.pathname === "/researcher/tasks";
  const { updateActivity } = useSimpleSession();

  // Add activity listeners to track user interaction
  useEffect(() => {
    const activityEvents = ["click", "keypress", "scroll", "mousemove"];

    const handleActivity = () => {
      updateActivity();
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <FlexibleHeader />
        <main className="pt-16">
          {isHomePage || isTasksPage ? (
            <Outlet />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Outlet />
              </div>
            </div>
          )}
        </main>
        <ScrollToTopButton />
      </div>
    </AuthGuard>
  );
}

export default UserLayout;
