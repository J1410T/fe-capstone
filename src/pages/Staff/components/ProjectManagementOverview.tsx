import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, Filter, Settings } from "lucide-react";

// Import new modular components
import { ProjectHierarchyCard } from "./ProjectManagement/ProjectHierarchyCard";
import { SidePanelContent } from "./ProjectManagement/SidePanelContent";
import { StatusBadge } from "./ProjectManagement/StatusBadge";
import {
  mockProjectClones,
  mockPIRequests,
  mockEnhancedMilestones,
} from "./ProjectManagement/mockData";
import { Project } from "./ProjectManagement/types";

// Legacy interfaces for compatibility with existing mock data
interface Document {
  id: string;
  name: string;
  uploadedAt: string;
}

// Legacy Project interface for existing mock data
interface LegacyProject {
  id: string;
  code: string;
  "english-title": string;
  "vietnamese-title": string;
  language: string;
  category: string;
  type: string;
  genre: string;
  status: string;
  progress: number;
  "maximum-member": number;
  "created-at": string;
  "updated-at": string | null;
  "creator-id": string;
  majors: Array<{
    id: string;
    name: string;
    field: {
      id: string;
      name: string;
    };
  }>;
  "project-tags": Array<{
    name: string;
  }>;
  council?: string; // Added for council assignment
}

// Mock data for legacy compatibility

const mockDocuments: Record<string, Document[]> = {
  "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d": [
    { id: "1", name: "Proposal.pdf", uploadedAt: "2025-01-10" },
    { id: "2", name: "ReviewReport.docx", uploadedAt: "2025-02-15" },
    { id: "3", name: "TechnicalSpec.pdf", uploadedAt: "2025-03-01" },
  ],
  "37262efd-0640-45bb-a5a6-148c54d9b7f6": [
    { id: "4", name: "ResearchPlan.pdf", uploadedAt: "2025-01-20" },
    { id: "5", name: "DataAnalysis.xlsx", uploadedAt: "2025-02-28" },
  ],
};

// Mock projects data (using the provided structure)
const mockProjects: LegacyProject[] = [
  {
    id: "7a117ebd-e5c0-459f-a977-075b492a9aa1",
    code: "PRJ015",
    "english-title":
      "BookStreet - The application helps people look up information about books for Ho Chi Minh city bookstreet company",
    "vietnamese-title":
      "BookStreet - Ứng dụng giúp mọi người tra cứu thông tin về sách cho công ty bookstreet thành phố Hồ Chí Minh",
    language: "English",
    category: "Application",
    type: "Mobile App",
    genre: "normal",
    status: "ongoing",
    progress: 75,
    "maximum-member": 5,
    "created-at": "2024-09-15T10:30:00Z",
    "updated-at": "2024-12-01T14:20:00Z",
    "creator-id": "user123",
    council: "Software Engineering Council",
    majors: [
      {
        id: "1",
        name: "Software Engineering",
        field: {
          id: "1",
          name: "Information Technology",
        },
      },
    ],
    "project-tags": [
      { name: "Mobile Development" },
      { name: "React Native" },
      { name: "Book Management" },
    ],
  },
  {
    id: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
    code: "PRJ016",
    "english-title": "Advanced Medical Diagnosis System using AI",
    "vietnamese-title": "Hệ thống chẩn đoán y tế tiên tiến sử dụng AI",
    language: "English",
    category: "Research",
    type: "AI System",
    genre: "propose",
    status: "ongoing",
    progress: 45,
    "maximum-member": 8,
    "created-at": "2024-10-01T09:00:00Z",
    "updated-at": "2024-12-05T16:45:00Z",
    "creator-id": "user456",
    council: "AI Research Council",
    majors: [
      {
        id: "2",
        name: "Artificial Intelligence",
        field: {
          id: "1",
          name: "Information Technology",
        },
      },
      {
        id: "3",
        name: "Biomedical Engineering",
        field: {
          id: "2",
          name: "Engineering",
        },
      },
    ],
    "project-tags": [
      { name: "Machine Learning" },
      { name: "Medical AI" },
      { name: "Computer Vision" },
      { name: "Healthcare" },
    ],
  },
  {
    id: "37262efd-0640-45bb-a5a6-148c54d9b7f6",
    code: "PRJ017",
    "english-title": "Smart Learning Management Platform",
    "vietnamese-title": "Nền tảng quản lý học tập thông minh",
    language: "Vietnamese",
    category: "Platform",
    type: "Web Application",
    genre: "normal",
    status: "completed",
    progress: 100,
    "maximum-member": 6,
    "created-at": "2024-08-20T11:15:00Z",
    "updated-at": "2024-11-30T13:30:00Z",
    "creator-id": "user789",
    council: "Education Technology Council",
    majors: [
      {
        id: "4",
        name: "Information Systems",
        field: {
          id: "1",
          name: "Information Technology",
        },
      },
    ],
    "project-tags": [
      { name: "Education Technology" },
      { name: "Learning Management" },
      { name: "Web Development" },
    ],
  },
  {
    id: "8f3e2d1c-9b8a-4567-8901-234567890abc",
    code: "PRJ018",
    "english-title": "Sustainable Energy Monitoring IoT System",
    "vietnamese-title": "Hệ thống IoT giám sát năng lượng bền vững",
    language: "English",
    category: "IoT System",
    type: "Hardware + Software",
    genre: "propose",
    status: "created",
    progress: 15,
    "maximum-member": 7,
    "created-at": "2024-11-10T08:45:00Z",
    "updated-at": null,
    "creator-id": "user101",
    majors: [
      {
        id: "5",
        name: "Electronics Engineering",
        field: {
          id: "2",
          name: "Engineering",
        },
      },
    ],
    "project-tags": [
      { name: "IoT" },
      { name: "Sustainability" },
      { name: "Energy Monitoring" },
      { name: "Embedded Systems" },
    ],
  },
];

const ProjectManagementOverview: React.FC = () => {
  const [projects] = useState<LegacyProject[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("projects");

  // Side panel state
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState<{
    type:
      | "proposal"
      | "clone"
      | "evaluation"
      | "request"
      | "milestone"
      | "council"
      | "project";
    data: unknown;
  } | null>(null);

  // Helper functions
  const openSidePanel = (
    type:
      | "proposal"
      | "clone"
      | "evaluation"
      | "request"
      | "milestone"
      | "council"
      | "project",
    data: unknown
  ) => {
    setSidePanelContent({ type, data });
    setSidePanelOpen(true);
  };

  const closeSidePanel = () => {
    setSidePanelOpen(false);
    setSidePanelContent(null);
  };

  // Council assignment handler
  const handleAssignCouncil = (projectId: string) => {
    openSidePanel("council", { projectId });
  };

  // Milestone approval handlers
  const handleApproveMilestone = (milestoneId: string) => {
    console.log("Approving milestone:", milestoneId);
    // Implementation for milestone approval
  };

  const handleRejectMilestone = (milestoneId: string) => {
    console.log("Rejecting milestone:", milestoneId);
    // Implementation for milestone rejection
  };

  // Filter projects based on search query and status
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project["english-title"]
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.majors.some((major: { id: string; name: string }) =>
            major.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          project["project-tags"].some((tag: { name: string }) =>
            tag.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((project) => project.genre === typeFilter);
    }

    return filtered;
  }, [projects, searchQuery, statusFilter, typeFilter]);

  // Toggle project expansion
  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Get principal investigator name
  const getPrincipalInvestigator = (creatorId: string) => {
    // Mock PI mapping
    const piMapping: Record<string, string> = {
      user123: "Dr. John Smith",
      user456: "Dr. Sarah Johnson",
      user789: "Prof. Michael Chen",
      user101: "Dr. Emily Davis",
    };
    return piMapping[creatorId] || "Unknown PI";
  };

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

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects, codes, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-base"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="ongoing">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="propose">Proposal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
      </div>

      {/* Main Content */}
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
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first project"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project) => (
                <ProjectHierarchyCard
                  key={project.id}
                  project={project as unknown as Project}
                  clones={mockProjectClones[project.id] || []}
                  milestones={mockEnhancedMilestones[project.id] || []}
                  documents={(mockDocuments[project.id] || []).map((doc) => ({
                    ...doc,
                    type: "supporting" as const,
                    content: `<h2>${doc.name}</h2><p>Document content for ${doc.name}</p>`,
                    uploadedBy: "System",
                    size: "1.0 MB",
                  }))}
                  expanded={expandedProjects.has(project.id)}
                  onToggleExpand={() => toggleProjectExpansion(project.id)}
                  onOpenSidePanel={openSidePanel}
                  getPrincipalInvestigator={getPrincipalInvestigator}
                  onAssignCouncil={handleAssignCouncil}
                  onApproveMilestone={handleApproveMilestone}
                  onRejectMilestone={handleRejectMilestone}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="space-y-4">
            {mockPIRequests.length === 0 ? (
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
              mockPIRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => openSidePanel("request", request)}
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
                            {projects.find((p) => p.id === request.projectId)?.[
                              "english-title"
                            ] || "Unknown Project"}
                          </p>
                        </div>
                        <StatusBadge
                          status={request.status}
                          type="request"
                          size="md"
                        />
                      </div>
                      <p className="text-base text-gray-700 mb-3">
                        {request.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted:{" "}
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <Button
                        variant="ghost"
                        size="default"
                        className="text-sm px-4 py-2"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Side Panel */}
      <Sheet open={sidePanelOpen} onOpenChange={setSidePanelOpen}>
        <SheetContent className="w-[700px] sm:max-w-[700px]">
          <SheetHeader>
            <SheetTitle className="text-xl">
              {sidePanelContent?.type === "proposal" && "Proposal Details"}
              {sidePanelContent?.type === "clone" && "Clone Details"}
              {sidePanelContent?.type === "evaluation" && "Evaluation Details"}
              {sidePanelContent?.type === "request" && "PI Request Details"}
              {sidePanelContent?.type === "milestone" && "Milestone Details"}
              {sidePanelContent?.type === "council" && "Council Assignment"}
              {sidePanelContent?.type === "project" && "Project Details"}
            </SheetTitle>
            <SheetDescription className="text-base">
              {sidePanelContent?.type === "proposal" &&
                "Review and manage proposal submission"}
              {sidePanelContent?.type === "clone" &&
                "Manage project clone and assignments"}
              {sidePanelContent?.type === "evaluation" &&
                "View evaluation results and feedback"}
              {sidePanelContent?.type === "request" &&
                "Review and process PI request"}
              {sidePanelContent?.type === "milestone" &&
                "View milestone evaluation and progress"}
              {sidePanelContent?.type === "council" &&
                "Assign council to project for review"}
              {sidePanelContent?.type === "project" &&
                "View comprehensive project information"}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-8">
            {sidePanelContent && (
              <SidePanelContent
                type={sidePanelContent.type}
                data={sidePanelContent.data}
                onClose={closeSidePanel}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProjectManagementOverview;
