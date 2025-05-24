import FlexibleHeader from "@/components/layout/header";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Outlet, useLocation } from "react-router-dom";

function UserLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/member/home";
  const isTasksPage = location.pathname === "/member/tasks";

  return (
    <LoadingProvider>
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
      </div>
    </LoadingProvider>
  );
}

export default UserLayout;
