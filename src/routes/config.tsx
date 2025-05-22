import AuthGuard from "../components/auth/AuthGuard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/StaffLayout";
import { Unauthorized } from "./Unauthorized";
import { Navigate, RouteObject, Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ErrorBoundaryPage from "../pages/ErrorBoundaryPage";
import { authRoutes } from "./auth";
import { UserRole } from "../contexts/AuthContext";
import { AuthProvider } from "../contexts/AuthContext";
import UserLayout from "../layouts/UserLayout";
import UserHome from "@/pages/UserHome";

// Host Institution Pages
import HostDashboard from "../pages/HostInstitution/Dashboard";
import RegisterProject from "../pages/HostInstitution/RegisterProject";
import ProjectsList from "../pages/HostInstitution/ProjectsList";
import ProjectDetails from "../pages/HostInstitution/ProjectDetails";
import ProjectHistory from "../pages/HostInstitution/ProjectHistory";
import PIApproval from "../pages/HostInstitution/PIApproval";

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
      // Redirect from home to member home for all users
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
          <AuthGuard>
            <UserLayout />
          </AuthGuard>
        ),
        children: [
          {
            path: "home",
            element: <UserHome />,
          },
          // Add more member routes here
        ],
      },
      // Dashboard routes for all users
      {
        path: "dashboard",
        element: (
          <AuthGuard>
            <UserLayout />
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
      // Host Institution routes
      {
        path: "host",
        element: (
          <AuthGuard requiredRoles={[UserRole.HOST_INSTITUTION]}>
            <UserLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/host/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <HostDashboard />,
          },
          {
            path: "register-project",
            element: <RegisterProject />,
          },
          {
            path: "pi-approval",
            element: <PIApproval />,
          },
          {
            path: "projects",
            element: <ProjectsList />,
          },
          {
            path: "project/:projectId",
            element: <ProjectDetails />,
          },
          {
            path: "history",
            element: <ProjectHistory />,
          },
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
