import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOutletContext } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, Filter, Settings } from "lucide-react";

// Import new modular components
import { SimpleProjectCard } from "./ProjectManagement/ProjectCard";
import { StatusBadge } from "./ProjectManagement/StatusBadge";
import { PIRequestDetailView } from "./ProjectManagement/PIRequestDetailView";
import { ProjectDetailView } from "./ProjectManagement/ProjectDetailView";
import { MilestoneDetailView } from "./ProjectManagement/MilestoneDetailView";
import { EvaluationDetailView } from "./ProjectManagement/EvaluationDetailView";
import { EvaluationStageDetailView } from "./ProjectManagement/EvaluationStageDetailView";
import { DocumentDetailView } from "./ProjectManagement/DocumentDetailView";
import { enhancedPIRequests } from "./ProjectManagement/enhancedMockData";
import {
  BreadcrumbItem,
  createBreadcrumbItem,
} from "./ProjectManagement/BreadcrumbNavigation";
import {
  SelectedMilestone,
  SelectedEvaluation,
  SelectedEvaluationStage,
  SelectedDocument,
  SelectedPIRequest,
  LegacyProject,
  Council,
} from "./ProjectManagement/detailViewTypes";

// Interface for outlet context from StaffLayout
interface StaffLayoutContext {
  breadcrumbItems: BreadcrumbItem[];
  setBreadcrumbItems: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
}

// Types are now imported from detailViewTypes.ts

const ProjectManagementOverview: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("projects");
  const [currentView, setCurrentView] = useState<
    | "overview"
    | "project-detail"
    | "milestone-detail"
    | "evaluation-detail"
    | "evaluation-stage-detail"
    | "document-detail"
    | "pi-request-detail"
  >("overview");
  const [selectedProject, setSelectedProject] = useState<LegacyProject | null>(
    null
  );
  const [selectedMilestone, setSelectedMilestone] =
    useState<SelectedMilestone | null>(null);
  const [selectedEvaluation] = useState<SelectedEvaluation | null>(null);
  const [selectedEvaluationStage] = useState<SelectedEvaluationStage | null>(
    null
  );
  const [selectedDocument] = useState<SelectedDocument | null>(null);
  const [selectedPIRequest, setSelectedPIRequest] =
    useState<SelectedPIRequest | null>(null);

  // Get breadcrumb functions from layout context
  const { setBreadcrumbItems } = useOutletContext<StaffLayoutContext>();

  // Initialize breadcrumbs
  useEffect(() => {
    if (currentView === "overview") {
      setBreadcrumbItems([
        createBreadcrumbItem("overview", "Projects", "overview"),
      ]);
    }
  }, [currentView, setBreadcrumbItems]);

  // Handle breadcrumb navigation events
  useEffect(() => {
    const handleBreadcrumbNavigate = (event: CustomEvent) => {
      const { item } = event.detail;

      // Navigate based on breadcrumb item type
      if (item.type === "overview") {
        // Navigate back to overview
        setCurrentView("overview");
        setSelectedProject(null);
        setSelectedMilestone(null);
        setSelectedPIRequest(null);
      } else if (item.type === "project" && item.data) {
        // Navigate back to project detail
        const project = item.data as LegacyProject;
        setSelectedProject(project);
        setCurrentView("project-detail");
        setSelectedMilestone(null);
        setSelectedPIRequest(null);
      } else if (item.type === "milestone" && item.data && selectedProject) {
        // Navigate back to milestone detail
        const milestone = item.data as SelectedMilestone;
        setSelectedMilestone(milestone);
        setCurrentView("milestone-detail");
      } else if (item.type === "request" && item.data) {
        // Navigate back to PI request detail
        const piRequest = item.data as SelectedPIRequest;
        setSelectedPIRequest(piRequest);
        setCurrentView("pi-request-detail");
        setSelectedProject(null);
        setSelectedMilestone(null);
      }
    };

    // Add event listener
    window.addEventListener(
      "breadcrumb-navigate",
      handleBreadcrumbNavigate as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "breadcrumb-navigate",
        handleBreadcrumbNavigate as EventListener
      );
    };
  }, [selectedProject]);

  // Mock projects data - using state to allow updates
  const [projects, setProjects] = useState<LegacyProject[]>(() => {
    return [
      {
        id: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
        "english-title": "Advanced Medical Diagnosis System",
        "vietnamese-title": "Hệ thống chẩn đoán y tế tiên tiến",
        status: "in_progress",
        "created-at": "2025-01-15",
        "creator-id": "user-001",
        code: "PRJ001",
        language: "English",
        category: "Research",
        type: "AI/ML",
        genre: "propose",
        "maximum-member": 5,
        progress: 65,
        "updated-at": "2025-01-20",
        majors: [
          { id: "major-1", name: "Computer Science" },
          { id: "major-2", name: "Medical Technology" },
        ],
        "project-tags": [
          { name: "AI" },
          { name: "Healthcare" },
          { name: "Machine Learning" },
        ],
      },
      {
        id: "37262efd-0640-45bb-a5a6-148c54d9b7f6",
        "english-title": "Smart Learning Management Platform",
        "vietnamese-title": "Nền tảng quản lý học tập thông minh",
        status: "completed",
        "created-at": "2025-01-10",
        "creator-id": "user-002",
        code: "PRJ002",
        language: "English",
        category: "Development",
        type: "Web Application",
        genre: "normal",
        "maximum-member": 8,
        progress: 100,
        "updated-at": "2025-01-25",
        majors: [
          { id: "major-3", name: "Software Engineering" },
          { id: "major-4", name: "Education Technology" },
        ],
        "project-tags": [
          { name: "Education" },
          { name: "Web Development" },
          { name: "Learning Analytics" },
        ],
      },
    ];
  });

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project["english-title"]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project["vietnamese-title"]
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  // Navigation function
  const navigateToPage = (
    type:
      | "project"
      | "evaluation"
      | "evaluation-stage"
      | "request"
      | "milestone"
      | "council"
      | "document"
      | "pi-request",
    data?: unknown
  ) => {
    if (type === "project" && data) {
      const project = data as LegacyProject;
      setSelectedProject(project);
      setCurrentView("project-detail");
      // Clear other selections
      setSelectedMilestone(null);
      setSelectedPIRequest(null);

      setBreadcrumbItems([
        createBreadcrumbItem("overview", "Projects", "overview"),
        createBreadcrumbItem(
          "project-detail",
          project["english-title"],
          "project",
          project
        ),
      ]);
    } else if (type === "milestone" && data && selectedProject) {
      const milestone = data as SelectedMilestone;
      setSelectedMilestone(milestone);
      setCurrentView("milestone-detail");

      setBreadcrumbItems([
        createBreadcrumbItem("overview", "Projects", "overview"),
        createBreadcrumbItem(
          "project-detail",
          selectedProject["english-title"],
          "project",
          selectedProject
        ),
        createBreadcrumbItem(
          "milestone-detail",
          milestone.title,
          "milestone",
          milestone
        ),
      ]);
    } else if (type === "request" && data) {
      const piRequest = data as SelectedPIRequest;
      setSelectedPIRequest(piRequest);
      setCurrentView("pi-request-detail");
      // Clear other selections
      setSelectedProject(null);
      setSelectedMilestone(null);

      setBreadcrumbItems([
        createBreadcrumbItem("overview", "Projects", "overview"),
        createBreadcrumbItem(
          "pi-request-detail",
          `PI Request - ${piRequest.projectRegistrationDetails.projectTitle}`,
          "request",
          piRequest
        ),
      ]);
    }
  };

  // Handle council assignment
  const handleAssignCouncil = (project: LegacyProject, council: Council) => {
    // Update the projects state with the assigned council
    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === project.id ? { ...p, assignedCouncil: council } : p
      )
    );

    // Update selected project if it's the one being assigned
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedProject({ ...selectedProject, assignedCouncil: council });
    }
  };

  // Render different detail views based on current state
  const renderDetailView = () => {
    switch (currentView) {
      case "project-detail":
        return (
          <ProjectDetailView
            selectedProject={selectedProject}
            navigateToPage={navigateToPage}
            onAssignCouncil={handleAssignCouncil}
          />
        );
      case "milestone-detail":
        return <MilestoneDetailView selectedMilestone={selectedMilestone} />;
      case "evaluation-detail":
        return <EvaluationDetailView selectedEvaluation={selectedEvaluation} />;
      case "evaluation-stage-detail":
        return (
          <EvaluationStageDetailView
            selectedEvaluationStage={selectedEvaluationStage}
          />
        );
      case "document-detail":
        return <DocumentDetailView selectedDocument={selectedDocument} />;
      case "pi-request-detail":
        return <PIRequestDetailView selectedPIRequest={selectedPIRequest} />;
      default:
        return null;
    }
  };

  if (currentView !== "overview") {
    return renderDetailView();
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Project Management
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage projects, proposals, evaluations, and PI requests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="default">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="requests">PI Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No projects found
              </h3>
              <p className="text-base text-gray-500 text-center">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <SimpleProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={() => navigateToPage("project", project)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="space-y-4">
            {enhancedPIRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No PI requests found
                </h3>
                <p className="text-base text-gray-500 text-center">
                  All requests have been processed
                </p>
              </div>
            ) : (
              enhancedPIRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigateToPage("request", request)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {request.requestType
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </h4>
                          <p className="text-base text-gray-600">
                            Project:{" "}
                            {request.projectRegistrationDetails?.projectTitle ||
                              "Unknown Project"}
                          </p>
                        </div>
                        <StatusBadge status={request.status} size="md" />
                      </div>
                      <p className="text-base text-gray-700 mb-3">
                        {request.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Submitted: {request.submittedAt}</span>
                        <span>•</span>
                        <span>ID: {request.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManagementOverview;
