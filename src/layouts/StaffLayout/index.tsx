import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import {
  BreadcrumbNavigation,
  BreadcrumbItem,
  createBreadcrumbItem,
} from "@/pages/Staff/components/ProjectManagement/BreadcrumbNavigation";
import { useState, useEffect } from "react";

/**
 * Staff layout with sidebar and breadcrumb navigation in header
 */
function StaffLayout() {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([
    createBreadcrumbItem("overview", "Projects", "overview"),
  ]);

  // Update breadcrumbs based on route
  useEffect(() => {
    if (location.pathname.includes("/staff/project-management")) {
      setBreadcrumbItems([
        createBreadcrumbItem("overview", "Projects", "overview"),
      ]);
    }
  }, [location.pathname]);

  const navigateToBreadcrumb = (item: BreadcrumbItem) => {
    // Find the index of the clicked item
    const itemIndex = breadcrumbItems.findIndex(
      (breadcrumb) => breadcrumb.id === item.id
    );

    if (itemIndex !== -1) {
      // Remove all items after the clicked item
      setBreadcrumbItems((prev) => prev.slice(0, itemIndex + 1));

      // Trigger a custom event to notify child components
      window.dispatchEvent(
        new CustomEvent("breadcrumb-navigate", {
          detail: {
            item,
            newBreadcrumbs: breadcrumbItems.slice(0, itemIndex + 1),
          },
        })
      );
    }
  };

  const navigateBack = () => {
    if (breadcrumbItems.length > 1) {
      // Remove the last breadcrumb item
      const newBreadcrumbs = breadcrumbItems.slice(0, -1);
      setBreadcrumbItems(newBreadcrumbs);

      // Trigger a custom event to notify child components
      window.dispatchEvent(
        new CustomEvent("breadcrumb-navigate", {
          detail: {
            item: newBreadcrumbs[newBreadcrumbs.length - 1],
            newBreadcrumbs,
          },
        })
      );
    }
  };

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
          {/* Breadcrumb Navigation */}
          {breadcrumbItems.length > 1 && (
            <BreadcrumbNavigation
              items={breadcrumbItems}
              onNavigate={navigateToBreadcrumb}
              onBack={navigateBack}
            />
          )}
        </header>
        <main className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-6">
              <Outlet context={{ breadcrumbItems, setBreadcrumbItems }} />
            </div>
          </div>
        </main>
        <ScrollToTopButton />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default StaffLayout;
