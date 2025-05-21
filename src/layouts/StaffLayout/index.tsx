import React from "react";
import { Outlet } from "react-router-dom";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { useAuth } from "@/contexts/AuthContext";

/**
 * Main layout with sidebar for staff users
 */
export const MainLayout: React.FC = () => {
  return (
    <LoadingProvider>
      <div>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="ml-auto flex items-center gap-2 px-4"></div>
            </header>
            <main className="flex-1 overflow-auto p-4">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </LoadingProvider>
  );
};

export default MainLayout;
