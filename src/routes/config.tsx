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
import ProjectEnroll from "@/pages/ProjectEnroll";

// RESEARCHER Pages
import UserTaskManagement from "@/pages/TaskManagement";

// Other Pages
import Profile from "@/pages/Profile";

// Scientific CV Pages
import CreateScientificCV from "@/pages/Profile/ScientificCV/CreateScientificCV";
import ViewScientificCV from "@/pages/Profile/ScientificCV/ViewScientificCV";
import EditScientificCV from "@/pages/Profile/ScientificCV/EditScientificCV";

// Host Institution Pages
import RegisterProject from "@/pages/HostInstitution/RegisterProject";
import MyProjects from "@/pages/HostInstitution/MyProjects";
import ProjectHistory from "@/pages/HostInstitution/ProjectHistory";

// Principal Investigator Pages

// Council Pages
import PendingEvaluations from "@/pages/Council/Evaluations";
import EvaluationDetail from "@/pages/Council/Evaluations/EvaluationDetail";
import EvaluationForm from "@/pages/Council/Evaluations/EvaluationForm";
import MeetingMinutes from "@/pages/Council/Meetings/MeetingMinutes";

// Admin Pages - simplified to use general coming soon

// General Coming Soon
import GeneralComingSoon from "@/pages/ComingSoon";

// Principal Investigator Pages
import ProjectRegistration from "@/pages/PrincipalInvestigator/ProjectRegistration";
import Meetings from "@/pages/Council/Meetings";
import ProjectApproval from "@/pages/Council/ProjectApproval";
// import FormRegister from "@/pages/FormRegister";
import FormsOverview from "@/pages/FormRegister/FormsOverview";
import FormCreate from "@/pages/FormRegister/FormCreate";
import FormView from "@/pages/FormRegister/FormView";
import FormEdit from "@/pages/FormRegister/FormEdit";
import MyProject from "@/pages/PrincipalInvestigator";

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
            path: "project/:projectId/enroll",
            element: <ProjectEnroll />,
          },
          {
            path: "tasks",
            element: <UserTaskManagement />,
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
            path: "my-projects",
            element: <MyProject />,
          },
          {
            path: "forms",
            children: [
              {
                index: true,
                element: <FormsOverview />,
              },
              {
                path: "create",
                element: <FormCreate />,
              },
              {
                path: ":formId/view",
                element: <FormView />,
              },
              {
                path: ":formId/edit",
                element: <FormEdit />,
              },
            ],
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
            path: "project/:projectId/enroll",
            element: <ProjectEnroll />,
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
            path: "forms",
            children: [
              {
                index: true,
                element: <FormsOverview />,
              },
              {
                path: "create",
                element: <FormCreate />,
              },
              {
                path: ":formId/view",
                element: <FormView />,
              },
              {
                path: ":formId/edit",
                element: <FormEdit />,
              },
            ],
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
            path: "project/:projectId/enroll",
            element: <ProjectEnroll />,
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
            path: "project/:projectId/enroll",
            element: <ProjectEnroll />,
          },
          {
            path: "project-enroll-form",
            element: <ProjectRegistration />,
          },
          {
            path: "profile",
            element: <Profile />,
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
            children: [
              {
                index: true,
                element: <FormsOverview />,
              },
              {
                path: "create",
                element: <FormCreate />,
              },
              {
                path: ":formId/view",
                element: <FormView />,
              },
              {
                path: ":formId/edit",
                element: <FormEdit />,
              },
            ],
          },
          {
            path: "my-projects",
            element: <MyProject />,
          },
        ],
      },
      // Unauthorized page
      {
        path: "unauthorized",
element: <Unauthorized />,
      },
      // Scientific CV routes (accessible by all authenticated users)
      {
        path: "profile/scientific-cv/create",
        element: (
          <AuthGuard>
            <CreateScientificCV />
          </AuthGuard>
        ),
      },
      {
        path: "profile/scientific-cv/view",
        element: (
          <AuthGuard>
            <ViewScientificCV />
          </AuthGuard>
        ),
      },
      {
        path: "profile/scientific-cv/edit",
        element: (
          <AuthGuard>
            <EditScientificCV />
          </AuthGuard>
        ),
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