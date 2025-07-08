import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import FlexibleHeader from "@/components/layout/header";
import AuthGuard from "@/components/auth/AuthGuard";
import { Outlet, useLocation } from "react-router-dom";

/**
 * Staff layout with sidebar for staff users
 */
function StaffLayout() {
  const location = useLocation();
  const hideHeader = location.pathname === "/login";

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col flex-1 overflow-hidden">
          {!hideHeader && <FlexibleHeader />}
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-6">
              <Outlet />
            </div>
          </div>
        </main>
        {/* Session Status Component - Temporarily disabled */}
        {/* <SessionStatus position="bottom-right" /> */}
      </SidebarProvider>
    </AuthGuard>
  );
}

export default StaffLayout;
