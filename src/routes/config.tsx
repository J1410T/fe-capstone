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

// Member Pages
import ProjectListing from "../pages/Member/ProjectListing";
import MemberProjectDetails from "../pages/Member/ProjectDetails";
import UserTaskManagement from "../pages/UserTaskManagement";
import MemberDashboard from "../pages/Member/Dashboard";

// Other Pages
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

// Host Institution Pages
import RegisterProject from "../pages/HostInstitution/RegisterProject";
import ProjectsList from "../pages/HostInstitution/ProjectsList";
import MyProjects from "../pages/HostInstitution/MyProjects";
import ProjectDetails from "../pages/HostInstitution/ProjectDetails";
import ProjectHistory from "../pages/HostInstitution/ProjectHistory";

// Council Pages
import CouncilPIApproval from "../pages/Council/PIApproval";
import PendingEvaluations from "../pages/Council/Evaluations";
import EvaluationDetail from "../pages/Council/Evaluations/EvaluationDetail";
import EvaluationForm from "../pages/Council/Evaluations/EvaluationForm";
import CouncilMeetings from "../pages/Council/Meetings";
import MeetingMinutes from "../pages/Council/Meetings/MeetingMinutes";
import ApprovalInterface from "../pages/Council/Approvals";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import UserManagement from "../pages/Admin/Users";
import SystemConfig from "../pages/Admin/System/Config";
import SystemLogs from "../pages/Admin/System/Logs";
import ApprovalManagement from "../pages/Admin/Approvals";

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
            element: <AdminDashboard />,
          },
          // User Management
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "users/roles",
            element: <UserManagement />,
          },
          // Projects
          {
            path: "projects",
            element: <ProjectsList />,
          },
          {
            path: "projects/create",
            element: <RegisterProject />,
          },
          // System Configuration
          {
            path: "system/config",
            element: <SystemConfig />,
          },
          {
            path: "system/logs",
            element: <SystemLogs />,
          },
          // Approvals
          {
            path: "approvals/pending",
            element: <ApprovalManagement />,
          },
          {
            path: "approvals/budget",
            element: <ApprovalManagement />,
          },
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
          {
            path: "projects",
            element: <ProjectListing />,
          },
          {
            path: "project/:projectId",
            element: <MemberProjectDetails />,
          },
          {
            path: "tasks",
            element: <UserTaskManagement />,
          },
          {
            path: "dashboard",
            element: <MemberDashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Settings />,
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
            element: <Navigate to="/host/my-projects" replace />,
          },
          {
            path: "register-project",
            element: <RegisterProject />,
          },
          {
            path: "my-projects",
            element: <MyProjects />,
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
      // Council routes
      {
        path: "council",
        element: (
          <AuthGuard requiredRoles={[UserRole.APPRAISAL_COUNCIL]}>
            <UserLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/council/evaluations" replace />,
          },
          {
            path: "pi-approval",
            element: <CouncilPIApproval />,
          },
          {
            path: "evaluations",
            element: <PendingEvaluations />,
          },
          {
            path: "evaluation/:id",
            element: <EvaluationDetail />,
          },
          {
            path: "evaluation/:id/form",
            element: <EvaluationForm />,
          },
          {
            path: "meetings",
            element: <CouncilMeetings />,
          },
          {
            path: "meeting/:id",
            element: <MeetingMinutes />,
          },
          {
            path: "approvals",
            element: <ApprovalInterface />,
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
