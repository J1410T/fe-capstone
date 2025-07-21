import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Outlet } from "react-router-dom";

/**
 * Staff layout with sidebar only (no header) for staff users
 */
function StaffLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default StaffLayout;
