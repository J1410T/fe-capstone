import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loading } from "@/components/ui/loaders";
import {
  BudgetTab,
  DocumentsTab,
  OverviewTab,
  ProjectProgress,
  TasksTab,
  TeamTab,
} from "@/pages/HostInstitution/ProjectDetails/components";
import { PiProjectHeader, RequestAccessForm } from "./components/index";

// Mock current user - trong thực tế sẽ lấy từ authentication context
// const currentUser = {
//   email: "john.doe@example.com", // Thay đổi email này để test các trường hợp khác nhau
//   name: "John Doe",
// };

// Mock project data
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
      role: "Co-Investigator",
      department: "Computer Science",
      email: "michael.johnson@example.com",
    },
    {
      name: "Dr. Sarah Williams",
      role: "Research Associate",
      department: "Medicine",
      email: "sarah.williams@example.com",
    },
    {
      name: "Robert Chen",
      role: "PhD Student",
      department: "Computer Science",
      email: "robert.chen@example.com",
    },
    {
      name: "Emily Davis",
      role: "PhD Student",
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

const PiProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<typeof projectData | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

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
      <PiProjectHeader
        title={project.title}
        status={project.status}
        pi={project.pi}
        hasAccess={true}
        onRequestAccess={() => setShowRequestForm(true)}
      />

      {/* Project Progress - Always show */}
      <ProjectProgress
        progress={project.progress}
        spent={project.budget.spent}
        total={project.budget.total}
      />

      {/* Register for Project Button - Only for PIs */}
      <div className="flex justify-end">
        <Button
          onClick={() => navigate("/pi/project-registration")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Register for Project
        </Button>
      </div>

      {/* Project Tabs - Show all tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            description={project.description}
            objectives={project.objectives}
            timeline={project.timeline}
          />
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <TeamTab team={project.team} />
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <TasksTab tasks={project.tasks} />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <DocumentsTab
            documents={project.documents}
            onDownload={handleDownloadDocument}
          />
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <BudgetTab
            total={project.budget.total}
            spent={project.budget.spent}
            allocated={project.budget.allocated}
          />
        </TabsContent>
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
};

export default PiProjectDetail;
