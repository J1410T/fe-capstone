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
import GlobalAuthListener from "@/components/auth/GlobalAuthListener";
import NavigationGuard from "@/components/auth/NavigationGuard";

// Staff Pages
import {
  DocumentFormsManagement,
  PaymentManagement,
  StaffDashboard,
  StaffProjectRegistration,
  ProjectManagementOverview,
  UserAccessControl,
  FieldsManagement,
  AppraisalCouncilsManagement,
  MajorsManagement,
  StaffMilestoneManagement,
  StaffMeetings,
} from "@/pages/Staff";

// General Pages
import ProjectsList from "@/pages/ProjectsList";
import ProjectDetail from "@/pages/ProjectDetail";

// RESEARCHER Pages
import UserTaskManagement from "@/pages/TaskManagement";
import ResearcherDashboard from "@/pages/Researcher/Dashboard";

// Other Pages
import Profile from "@/pages/Profile";

// Host Institution Pages
import RegisterProject from "@/pages/HostInstitution/RegisterProject";
import MyProjects from "@/pages/HostInstitution/MyProjects";
import ProjectHistory from "@/pages/HostInstitution/ProjectHistory";

// Principal Investigator Pages
import PIMyProjects from "@/pages/PrincipalInvestigator/MyProjects";

// Council Pages
import PendingEvaluations from "@/pages/Council/Evaluations";
import EvaluationDetail from "@/pages/Council/Evaluations/EvaluationDetail";
import EvaluationForm from "@/pages/Council/Evaluations/EvaluationForm";
import MeetingMinutes from "@/pages/Council/Meetings/MeetingMinutes";

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
import TestRedirect from "@/pages/TestRedirect";

/**
 * Main application routes configuration
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AuthProvider>
        <GlobalAuthListener />
        <NavigationGuard />
        <Outlet />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundaryPage />,
    children: [
      // Redirect from home to RESEARCHER home for all users
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
          {
            path: "test-redirect",
            element: <TestRedirect />,
          },
        ],
      },
      // Staff routes with sidebar - protected by AuthGuard
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
            element: <StaffDashboard />,
          },
          {
            path: "dashboard",
            element: <StaffDashboard />,
          },
          {
            path: "forms",
            element: <DocumentFormsManagement />,
          },
          {
            path: "projects",
            children: [
              {
                index: true,
                element: <ProjectManagementOverview />,
              },
              {
                path: "register",
                element: <StaffProjectRegistration />,
              },
              {
                path: "overview",
                element: <ProjectManagementOverview />,
              },
            ],
          },
          {
            path: "payments",
            element: <PaymentManagement />,
          },
          {
            path: "users",
            element: <UserAccessControl />,
          },
          {
            path: "meetings",
            element: <StaffMeetings />,
          },
          {
            path: "fields",
            element: <FieldsManagement />,
          },
          {
            path: "councils",
            element: <AppraisalCouncilsManagement />,
          },
          {
            path: "majors",
            element: <MajorsManagement />,
          },
          {
            path: "milestones",
            children: [
              {
                path: "management",
                element: <StaffMilestoneManagement />,
              },
            ],
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "*",
            element: <StaffDashboard />,
          },
        ],
      },
      {
        path: "researcher",
        element: (
          <AuthGuard requiredRoles={[UserRole.RESEARCHER]}>
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
            element: <ResearcherDashboard />,
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
          // Add more RESEARCHER routes here
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
            path: "meeting/:id",
            element: <MeetingMinutes />,
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
            path: "meeting/:id",
            element: <MeetingMinutes />,
          },
          {
            path: "forms",
            element: <FormRegister />,
          },
          {
            path: "my-projects",
            element: <PIMyProjects />,
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
