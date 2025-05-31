import {
  Button,
  Loading,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  DocumentsTab,
  OverviewTab,
  ProjectHeader,
  ProjectProgress,
  TasksTab,
  TeamTab,
} from "./components";
import BudgetTab from "./components/BudgetTab";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { RequestAccessForm } from "./components/RequestAccessForm";

const projectData = {
  id: 1,
  title: "Machine Learning for Medical Diagnosis",
  description:
    "This research project aims to develop AI algorithms for early disease detection and diagnosis, focusing on improving healthcare outcomes through machine learning and data analysis.",
  pi: "Dr. Jane Smith",
  department: "Computer Science",
  year: "2023",
  status: "In Progress",
  progress: 65,
  budget: {
    total: "$120,000",
    spent: "$78,000",
    allocated: {
      personnel: "$60,000",
      equipment: "$30,000",
      travel: "$10,000",
      materials: "$15,000",
      other: "$5,000",
    },
  },
  objectives: [
    "Develop machine learning models for disease prediction",
    "Create algorithms for medical image analysis",
    "Design user-friendly interfaces for healthcare professionals",
    "Validate system accuracy through clinical trials",
  ],
  timeline: [
    {
      phase: "Planning & Requirements",
      duration: "Jan 2023 - Feb 2023",
      status: "Completed",
    },
    {
      phase: "Data Collection & Analysis",
      duration: "Mar 2023 - May 2023",
      status: "Completed",
    },
    {
      phase: "Algorithm Development",
      duration: "Jun 2023 - Sep 2023",
      status: "In Progress",
    },
    {
      phase: "Testing & Validation",
      duration: "Oct 2023 - Dec 2023",
      status: "Pending",
    },
  ],
  team: [
    {
      name: "Dr. Jane Smith",
      role: "Principal Investigator",
      department: "Computer Science",
      email: "jane.smith@example.com",
    },
    {
      name: "Dr. Michael Johnson",
      role: "Leader",
      department: "Computer Science",
      email: "michael.johnson@example.com",
    },
    {
      name: "Dr. Sarah Williams",
      role: "Secretary",
      department: "Medicine",
      email: "sarah.williams@example.com",
    },
    {
      name: "Robert Chen",
      role: "Member",
      department: "Computer Science",
      email: "robert.chen@example.com",
    },
    {
      name: "Emily Davis",
      role: "Member",
      department: "Medicine",
      email: "emily.davis@example.com",
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Data collection from partner hospitals",
      assignee: "Dr. Sarah Williams",
      dueDate: "July 15, 2023",
      status: "Completed",
      priority: "High",
    },
    {
      id: 2,
      title: "Develop initial ML model prototype",
      assignee: "Robert Chen",
      dueDate: "August 30, 2023",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 3,
      title: "Create user interface mockups",
      assignee: "Emily Davis",
      dueDate: "September 10, 2023",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: 4,
      title: "Prepare mid-project report",
      assignee: "Dr. Jane Smith",
      dueDate: "September 15, 2023",
      status: "Pending",
      priority: "Medium",
    },
    {
      id: 5,
      title: "Plan clinical validation study",
      assignee: "Dr. Michael Johnson",
      dueDate: "October 1, 2023",
      status: "Pending",
      priority: "Low",
    },
  ],
  documents: [
    {
      id: 1,
      name: "Project Proposal",
      type: "PDF",
      uploadedBy: "Dr. Jane Smith",
      uploadDate: "January 5, 2023",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Data Collection Protocol",
      type: "DOCX",
      uploadedBy: "Dr. Sarah Williams",
      uploadDate: "March 10, 2023",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Algorithm Specifications",
      type: "PDF",
      uploadedBy: "Robert Chen",
      uploadDate: "June 22, 2023",
      size: "3.5 MB",
    },
    {
      id: 4,
      name: "Progress Report Q2",
      type: "PDF",
      uploadedBy: "Dr. Jane Smith",
      uploadDate: "July 15, 2023",
      size: "4.2 MB",
    },
  ],
  reports: [
    {
      name: "Initial Progress Report",
      date: "April 15, 2023",
      status: "Submitted",
    },
    {
      name: "Quarterly Review Q2",
      date: "July 1, 2023",
      status: "Submitted",
    },
    {
      name: "Quarterly Review Q3",
      date: "October 1, 2023",
      status: "Pending",
    },
    {
      name: "Annual Report",
      date: "December 31, 2023",
      status: "Pending",
    },
  ],
};

function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<typeof projectData | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [memberRole, setMemberRole] = useState<
    "Member" | "Leader" | "Secretary"
  >("Member");

  useEffect(() => {
    // Simulate API call to fetch project details
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch data from an API
        // For now, we'll use the mock data
        setTimeout(() => {
          setProject(projectData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleDownloadDocument = (documentId: number) => {
    // Handle document download
    console.log(`Downloading document ${documentId}`);
  };

  const handleRequestAccess = (requestData: {
    name: string;
    email: string;
    institution: string;
    position: string;
    reason: string;
    experience: string;
  }) => {
    // Handle access request submission
    console.log("Access request submitted:", requestData);
    setShowRequestForm(false);
    // In real app, you would make API call here
  };

  // Determine which tabs to show based on user role and switch state
  const getVisibleTabs = () => {
    if (!user) return ["overview", "team"];

    switch (user.role) {
      case UserRole.PRINCIPAL_INVESTIGATOR:
        return showAllTabs
          ? ["overview", "team", "tasks", "documents", "budget"]
          : ["overview", "team"];
      case UserRole.MEMBER:
        return showAllTabs
          ? ["overview", "team", "tasks", "documents", "budget"]
          : ["overview", "team"];
      case UserRole.HOST_INSTITUTION:
      case UserRole.APPRAISAL_COUNCIL:
        return ["overview", "team"];
      default:
        return ["overview", "team"];
    }
  };

  const visibleTabs = getVisibleTabs();

  // Show Enroll Project button for PI in Overview tab only when switch is true
  const shouldShowEnrollButton =
    user?.role === UserRole.PRINCIPAL_INVESTIGATOR && showAllTabs;

  if (isLoading) {
    return <Loading />;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The project you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => navigate("/host/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <ProjectHeader
        title={project.title}
        status={project.status}
        pi={project.pi}
        showAllTabs={showAllTabs}
        onToggleAllTabs={setShowAllTabs}
        memberRole={memberRole}
        onMemberRoleChange={setMemberRole}
      />

      {/* Project Progress - Always show */}
      <ProjectProgress
        progress={project.progress}
        spent={project.budget.spent}
        total={project.budget.total}
      />

      {/* Project Tabs - Dynamic based on role and switch */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`grid w-full ${
            visibleTabs.length === 2
              ? "grid-cols-2"
              : visibleTabs.length === 3
              ? "grid-cols-3"
              : visibleTabs.length === 4
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          } gap-1`}
        >
          {visibleTabs.includes("overview") && (
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
          )}
          {visibleTabs.includes("team") && (
            <TabsTrigger value="team" className="text-xs sm:text-sm">
              Team
            </TabsTrigger>
          )}
          {visibleTabs.includes("tasks") && (
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">
              Tasks
            </TabsTrigger>
          )}
          {visibleTabs.includes("documents") && (
            <TabsTrigger value="documents" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
          )}
          {visibleTabs.includes("budget") && (
            <TabsTrigger value="budget" className="text-xs sm:text-sm">
              Budget
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        {visibleTabs.includes("overview") && (
          <TabsContent value="overview" className="space-y-4">
            <OverviewTab
              description={project.description}
              objectives={project.objectives}
              timeline={project.timeline}
              showEnrollButton={shouldShowEnrollButton}
              onEnrollProject={() =>
                navigate("/pi/project-enroll-form", {
                  state: { from: location.pathname },
                })
              }
            />
          </TabsContent>
        )}

        {/* Team Tab */}
        {visibleTabs.includes("team") && (
          <TabsContent value="team" className="space-y-4">
            <TeamTab
              team={
                project.team as Array<{
                  name: string;
                  role:
                    | "Member"
                    | "Leader"
                    | "Secretary"
                    | "Principal Investigator";
                  department: string;
                  email: string;
                }>
              }
              showEditingButtons={
                user?.role === UserRole.PRINCIPAL_INVESTIGATOR
                  ? showAllTabs
                  : false
              }
            />
          </TabsContent>
        )}

        {/* Tasks Tab */}
        {visibleTabs.includes("tasks") && (
          <TabsContent value="tasks" className="space-y-4">
            <TasksTab tasks={project.tasks} />
          </TabsContent>
        )}

        {/* Documents Tab */}
        {visibleTabs.includes("documents") && (
          <TabsContent value="documents" className="space-y-4">
            <DocumentsTab
              documents={project.documents}
              onDownload={handleDownloadDocument}
            />
          </TabsContent>
        )}

        {/* Budget Tab */}
        {visibleTabs.includes("budget") && (
          <TabsContent value="budget" className="space-y-4">
            <BudgetTab />
          </TabsContent>
        )}
      </Tabs>

      {/* Request Access Form Modal */}
      {showRequestForm && (
        <RequestAccessForm
          projectTitle={project.title}
          onSubmit={handleRequestAccess}
          onCancel={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetail;
