import AuthGuard from "@/components/auth/AuthGuard";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/StaffLayout";
import DashboardLayout from "@/layouts/UsersLayout";
import { Unauthorized } from "./Unauthorized";
import { Navigate, RouteObject, Outlet } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import ErrorBoundaryPage from "@/pages/ErrorBoundaryPage";
import { authRoutes } from "./auth";
import { UserRole } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";

/**
 * Main application routes configuration
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundaryPage />,
    children: [
      // Redirect from home to dashboard if logged in
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // Staff routes with sidebar
      {
        path: "staff",
        element: (
          <AuthGuard requiredRoles={[UserRole.STAFF]}>
            <MainLayout />
          </AuthGuard>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          // Add more staff routes here
        ],
      },
      // Dashboard routes without sidebar for other roles
      {
        path: "dashboard",
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          // Add more dashboard routes here
        ],
      },
      // Unauthorized page
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      // Auth routes (login, register, etc.)
      {
        path: "auth",
        element: <AuthLayout />,
        children: [...authRoutes],
      },
      // Catch all route - 404
      {
        path: "*",
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
];
