import AuthGuard from "@/components/auth/AuthGuard";
import AuthLayout from "@/layouts/AuthLayout";
import StaffLayout from "@/layouts/StaffLayout";
import { Unauthorized } from "./Unauthorized";
import { Navigate, RouteObject, Outlet } from "react-router-dom";
import ErrorBoundaryPage from "@/pages/ErrorBoundaryPage";
import { authRoutes } from "./auth";
import { UserRole } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import UserLayout from "@/layouts/UserLayout";
import UserHome from "@/pages/UserHome";

// General Pages
import ProjectsList from "@/pages/ProjectsList";
import ProjectDetail from "@/pages/ProjectDetail";

// Member Pages
import UserTaskManagement from "@/pages/TaskManagement";
import MemberDashboard from "@/pages/Member/Dashboard";

// Other Pages
import Profile from "@/pages/Profile";

// Host Institution Pages
import RegisterProject from "@/pages/HostInstitution/RegisterProject";
import MyProjects from "@/pages/HostInstitution/MyProjects";
import ProjectHistory from "@/pages/HostInstitution/ProjectHistory";

// Council Pages
import PendingEvaluations from "@/pages/Council/Evaluations";
import EvaluationDetail from "@/pages/Council/Evaluations/EvaluationDetail";
import EvaluationForm from "@/pages/Council/Evaluations/EvaluationForm";
import ScheduleMeeting from "@/pages/Council/Meetings/ScheduleMeeting";
import MeetingMinutes from "@/pages/Council/Meetings/MeetingMinutes";
import ApprovalInterface from "@/pages/Council/Approvals";

// Admin Pages - simplified to use general coming soon

// General Coming Soon
import GeneralComingSoon from "@/pages/ComingSoon";

// Principal Investigator Pages
import PIProfile from "@/pages/PrincipalInvestigator/Profile";
import ProjectRegistration from "@/pages/PrincipalInvestigator/ProjectRegistration";
import PIDashboard from "@/pages/PrincipalInvestigator/Dashboard";
import Meetings from "@/pages/Council/Meetings";
import ProjectApproval from "@/pages/Council/ProjectApproval";
import FormRegister from "@/pages/FormRegister";

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
      // Staff routes with sidebar - simplified layout only
      {
        path: "staff",
        element: (
          <AuthGuard requiredRoles={[UserRole.STAFF]}>
            <StaffLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <GeneralComingSoon />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "*",
            element: <GeneralComingSoon />,
          },
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
          {
            path: "projects",
            element: <ProjectsList />,
          },
          {
            path: "project/:projectId",
            element: <ProjectDetail />,
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
            path: "notifications",
            element: <GeneralComingSoon />,
          },
          {
            path: "forms",
            element: <FormRegister />,
          },
          {
            path: "my-projects",
            element: <ProjectDetail />,
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
            element: <ProjectDetail />,
          },
          {
            path: "history",
            element: <ProjectHistory />,
          },
          {
            path: "profile",
            element: <Profile />,
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
            path: "project-approval",
            element: <ProjectApproval />,
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
            element: <Meetings />,
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
          {
            path: "project/:projectId",
            element: <ProjectDetail />,
          },
          {
            path: "profile",
            element: <Profile />,
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
            element: <ProjectDetail />,
          },
          {
            path: "project-enroll-form",
            element: <ProjectRegistration />,
          },
          {
            path: "profile",
            element: <PIProfile />,
          },
          {
            path: "dashboard",
            element: <PIDashboard />,
          },
          {
            path: "meetings",
            element: <Meetings />,
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
            path: "forms",
            element: <FormRegister />,
          },
          {
            path: "my-projects",
            element: <MyProjects />,
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
