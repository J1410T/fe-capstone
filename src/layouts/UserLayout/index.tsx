import FlexibleHeader from "@/components/layout/header";
import { Outlet, useLocation } from "react-router-dom";
import AuthGuard from "@/components/auth/AuthGuard";

function UserLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  const isTasksPage = location.pathname === "/researcher/tasks";

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
      </div>
    </AuthGuard>
  );
}

export default UserLayout;
