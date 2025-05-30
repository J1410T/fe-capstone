import AuthGuard from "../components/auth/AuthGuard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/StaffLayout";
import { Unauthorized } from "./Unauthorized";
import { Navigate, RouteObject, Outlet } from "react-router-dom";
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
import ScheduleMeeting from "../pages/Council/Meetings/ScheduleMeeting";
import MeetingMinutes from "../pages/Council/Meetings/MeetingMinutes";
import ApprovalInterface from "../pages/Council/Approvals";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import UserManagement from "../pages/Admin/Users";
import SystemConfig from "../pages/Admin/System/Config";
// import SystemLogs from "../pages/Admin/System/Logs"; // TODO: Create SystemLogs component
import ApprovalManagement from "../pages/Admin/Approvals";
import AdminComingSoon from "../pages/Admin/ComingSoon";

// General Coming Soon
import GeneralComingSoon from "../pages/ComingSoon";
import PiProjectDetail from "@/pages/PrincipalInvestigator/PiProjectDetail";

// Principal Investigator Pages
import PIProfile from "@/pages/PrincipalInvestigator/Profile";
import ProjectRegistration from "@/pages/PrincipalInvestigator/ProjectRegistration";
import ResearchGroup from "@/pages/PrincipalInvestigator/ResearchGroup";
import Milestones from "@/pages/PrincipalInvestigator/Milestones";
import ProgressReports from "@/pages/PrincipalInvestigator/ProgressReports";
import Budget from "@/pages/PrincipalInvestigator/Budget";
import PIDashboard from "@/pages/PrincipalInvestigator/Dashboard";
import Meetings from "@/pages/PrincipalInvestigator/Meetings";

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
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/",
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
        ],
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
            element: <AdminComingSoon />,
          },
          // Projects
          {
            path: "projects",
            element: <ProjectsList />,
          },
          {
            path: "projects/create",
            element: <AdminComingSoon />,
          },
          {
            path: "projects/templates",
            element: <AdminComingSoon />,
          },
          {
            path: "projects/recent",
            element: <AdminComingSoon />,
          },
          {
            path: "projects/stats",
            element: <AdminComingSoon />,
          },
          // System Configuration
          {
            path: "system/config",
            element: <SystemConfig />,
          },
          {
            path: "system/logs",
            element: <AdminComingSoon />, // TODO: Replace with <SystemLogs /> when component is created
          },
          {
            path: "system/backup",
            element: <AdminComingSoon />,
          },
          // Approvals
          {
            path: "approvals/pending",
            element: <ApprovalManagement />,
          },
          {
            path: "approvals/budget",
            element: <AdminComingSoon />,
          },
          {
            path: "approvals/templates",
            element: <AdminComingSoon />,
          },
          // Security
          {
            path: "security",
            element: <AdminComingSoon />,
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
          {
            path: "notifications",
            element: <GeneralComingSoon />,
          },
          {
            path: "forms/*",
            element: <GeneralComingSoon />,
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
          {
            path: "forms/*",
            element: <GeneralComingSoon />,
          },
          {
            path: "project/*",
            element: <GeneralComingSoon />,
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
            path: "meetings/schedule",
            element: <ScheduleMeeting />,
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
      // Principal Investigator routes
      {
        path: "pi",
        element: (
          <AuthGuard requiredRoles={[UserRole.PRINCIPAL_INVESTIGATOR]}>
            <UserLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/pi/dashboard" replace />,
          },
          {
            path: "projects",
            element: <ProjectsList />,
          },
          {
            path: "project/:projectId",
            element: <PiProjectDetail />,
          },
          {
            path: "project-registration",
            element: <ProjectRegistration />,
          },
          {
            path: "profile",
            element: <PIProfile />,
          },
          {
            path: "research-group",
            element: <ResearchGroup />,
          },
          {
            path: "milestones",
            element: <Milestones />,
          },
          {
            path: "progress-reports",
            element: <ProgressReports />,
          },
          {
            path: "budget",
            element: <Budget />,
          },
          {
            path: "dashboard",
            element: <PIDashboard />,
          },
          {
            path: "meetings",
            element: <Meetings />,
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
      // Catch all route - Coming Soon for authenticated users, login for unauthenticated
      {
        path: "*",
        element: (
          <AuthGuard>
            <GeneralComingSoon />
          </AuthGuard>
        ),
      },
    ],
  },
];
