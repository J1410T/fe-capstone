import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Outlet } from "react-router-dom";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";

/**
 * Staff layout with sidebar only (no header) for staff users
 */
function StaffLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <main className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-6">
              <Outlet />
            </div>
          </div>
        </main>
        <ScrollToTopButton />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default StaffLayout;
