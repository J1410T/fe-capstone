import AuthGuard from "../components/auth/AuthGuard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { Unauthorized } from "./Unauthorized";
import { Navigate, RouteObject, Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ErrorBoundaryPage from "../pages/ErrorBoundaryPage";
import { authRoutes } from "./auth";
import { UserRole } from "../contexts/AuthContext";
import { AuthProvider } from "../contexts/AuthContext";
import UserLayout from "../layouts/UserLayout";
import UserHome from "@/pages/UserHome";

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
      // Redirect from home to member home if logged in
      {
        index: true,
        element: <Navigate to="/member/home" replace />,
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
      {
        path: "member",
        element: (
          <AuthGuard requiredRoles={[UserRole.MEMBER]}>
            <UserLayout />
          </AuthGuard>
        ),
        children: [
          {
            path: "home",
            element: <UserHome />,
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
