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
import { useStaffProjectFilter } from "@/hooks/queries/project";
import { StaffProjectFilterRequest } from "@/types/project";

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
  const [sortBy, setSortBy] = useState<"createdate" | "englishtitle">(
    "createdate"
  );
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
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

  // API request parameters
  const projectFilterRequest: StaffProjectFilterRequest = useMemo(
    () => ({
      title: searchTerm,
      genres: ["propose", "normal"],
      statuses:
        statusFilter === "all"
          ? ["created"]
          : [
              statusFilter as
                | "created"
                | "inprogress"
                | "completed"
                | "cancelled",
            ],
      "page-index": currentPage,
      "page-size": pageSize,
      "sort-by": sortBy,
      desc: sortDesc,
      "include-creator": true,
      "include-members": true,
    }),
    [searchTerm, statusFilter, currentPage, pageSize, sortBy, sortDesc]
  );

  // Fetch projects using the new API
  const {
    data: projectsData,
    isLoading,
    error,
  } = useStaffProjectFilter(projectFilterRequest);

  // Get projects from API data and map to LegacyProject format
  const projects: LegacyProject[] = useMemo(() => {
    return (projectsData?.["data-list"] || []).map((project) => ({
      id: project.id,
      "english-title": project["english-title"],
      "vietnamese-title": project["vietnamese-title"],
      status: project.status,
      "created-at": project["created-at"],
      "creator-id": project["creator-id"],
      code: project.code || "",
      language: project.language,
      category: project.category,
      type: project.type,
      genre: project.genre,
      "maximum-member": project["maximum-member"],
      progress: project.progress || 0,
      "updated-at": project["updated-at"] || undefined,
      majors: project.majors || [],
      "project-tags": project["project-tags"] || [],
      // Additional fields
      abbreviations: project.abbreviations || undefined,
      duration: project.duration || undefined,
      description: project.description || undefined,
      "requirement-note": project["requirement-note"] || undefined,
      creator: project.creator
        ? {
            id: project.creator.id,
            "full-name": project.creator["full-name"] || "",
            email: project.creator.email || "",
            "avatar-url": project.creator["avatar-url"] || "",
          }
        : undefined,
    }));
  }, [projectsData]);

  const totalCount = projectsData?.["total-count"] || 0;
  const totalPages = projectsData?.["total-page"] || 0;

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
    // Update selected project if it's the one being assigned
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedProject({ ...selectedProject, assignedCouncil: council });
    }
    // Note: In a real implementation, you would also call an API to update the project
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            Project Management
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2 break-words">
            Manage projects, proposals, evaluations, and PI requests
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Button variant="outline" size="default" className="w-full sm:w-auto">
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden xs:inline">Settings</span>
            <span className="xs:hidden">Config</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        {/* Search bar - full width on mobile */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: "createdate" | "englishtitle") =>
              setSortBy(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdate">Created Date</SelectItem>
              <SelectItem value="englishtitle">English Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortDesc(!sortDesc)}
            className="px-3 w-full sm:w-auto"
          >
            <span className="sm:hidden">
              Sort {sortDesc ? "Descending" : "Ascending"}
            </span>
            <span className="hidden sm:inline">{sortDesc ? "↓" : "↑"}</span>
          </Button>
        </div>
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-base text-gray-500">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Error loading projects
              </h3>
              <p className="text-base text-gray-500 text-center">
                Please try again later
              </p>
            </div>
          ) : projects.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <SimpleProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={() => navigateToPage("project", project)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalCount)} of{" "}
                    {totalCount} projects
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3"
                    >
                      <span className="hidden xs:inline">Previous</span>
                      <span className="xs:hidden">Prev</span>
                    </Button>
                    <span className="text-sm text-gray-500 px-2">
                      {currentPage}/{totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3"
                    >
                      <span className="hidden xs:inline">Next</span>
                      <span className="xs:hidden">Next</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
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
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigateToPage("request", request)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 break-words">
                            {request.requestType
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </h4>
                          <p className="text-base text-gray-600 break-words">
                            Project:{" "}
                            {request.projectRegistrationDetails?.projectTitle ||
                              "Unknown Project"}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge status={request.status} size="md" />
                        </div>
                      </div>
                      <p className="text-base text-gray-700 mb-3 break-words">
                        {request.description}
                      </p>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm text-gray-500">
                        <span className="break-words">
                          Submitted: {request.submittedAt}
                        </span>
                        <span className="hidden xs:inline">•</span>
                        <span className="break-words">ID: {request.id}</span>
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
