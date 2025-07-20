import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Folder,
} from "lucide-react";

// Project interface based on the provided data structure
interface Project {
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
}

// Mock milestone data
interface Milestone {
  id: string;
  title: string;
  scheduledDate: string;
  status: "completed" | "ongoing" | "upcoming";
}

// Mock document data
interface Document {
  id: string;
  name: string;
  uploadedAt: string;
}

// Mock data for milestones and documents
const mockMilestones: Record<string, Milestone[]> = {
  "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d": [
    { id: "1", title: "Project Proposal", scheduledDate: "2025-01-15", status: "completed" },
    { id: "2", title: "Mid-Term Review", scheduledDate: "2025-03-15", status: "ongoing" },
    { id: "3", title: "Final Presentation", scheduledDate: "2025-05-15", status: "upcoming" },
  ],
  "37262efd-0640-45bb-a5a6-148c54d9b7f6": [
    { id: "4", title: "Research Phase", scheduledDate: "2025-02-01", status: "completed" },
    { id: "5", title: "Development Phase", scheduledDate: "2025-04-01", status: "ongoing" },
  ],
};

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
const mockProjects: Project[] = [
  {
    id: "7a117ebd-e5c0-459f-a977-075b492a9aa1",
    code: "PRJ015",
    "english-title": "BookStreet - The application helps people look up information about books for Ho Chi Minh city bookstreet company",
    "vietnamese-title": "BookStreet - Ứng dụng giúp mọi người tra cứu thông tin về sách cho công ty đường sách TP.HCM",
    language: "Vietnamese",
    category: "basic",
    type: "school level",
    genre: "proposal",
    status: "created",
    progress: 15,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "403c10a6-4889-49c6-b3b7-75d65572e1ee",
    majors: [],
    "project-tags": [],
  },
  {
    id: "319ad3ec-7c7b-433e-9cdf-0ba9fa9b182d",
    code: "PRJ002",
    "english-title": "Science Research Project Management",
    "vietnamese-title": "Ứng dụng quản lý đề tài khoa học",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "normal",
    status: "created",
    progress: 45,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "5439fe48-5101-4266-a10f-afabcafb2f74",
    majors: [
      {
        id: "74c32ee6-b8a6-4455-8b34-02321af11590",
        name: "Software Engineering",
        field: {
          id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
          name: "Information Technology"
        }
      },
      {
        id: "b32a4b6e-3d34-4f79-a345-6b7c08e28474",
        name: "Computer Networks & Data Communication",
        field: {
          id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
          name: "Information Technology"
        }
      }
    ],
    "project-tags": [
      { name: "task management" },
      { name: "science" },
      { name: "research" },
      { name: "management" },
      { name: "project" },
      { name: "task" },
      { name: "project management" },
      { name: "AI plagmarism" }
    ],
  },
  {
    id: "37262efd-0640-45bb-a5a6-148c54d9b7f6",
    code: "PRJ001",
    "english-title": "AI-based Learning Support System",
    "vietnamese-title": "Hệ thống hỗ trợ học tập dùng AI",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "normal",
    status: "created",
    progress: 75,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "5439fe48-5101-4266-a10f-afabcafb2f74",
    majors: [
      {
        id: "57027f18-9e31-40e6-8df7-633bed2a0131",
        name: "Artificial Intelligence",
        field: {
          id: "b0686776-c61c-44d2-a17a-8c05fc6fd7f6",
          name: "Information Technology"
        }
      },
      {
        id: "43933e55-b97a-4920-ae62-f1b3c3c111db",
        name: "Psychology",
        field: {
          id: "cf080a69-8860-4751-91f2-c320c767dfb2",
          name: "Social Sciences & Humanities"
        }
      }
    ],
    "project-tags": [],
  },
  {
    id: "a07cbf07-c165-459c-b99f-2023cbe32653",
    code: "PRJ007",
    "english-title": "FUC - Capstone management system for FPT university teachers and students",
    "vietnamese-title": "FUC - Hệ thống quản lý đồ án cho giảng viên và sinh viên của trường đại học FPT",
    language: "English",
    category: "basic",
    type: "school level",
    genre: "propose",
    status: "created",
    progress: 30,
    "maximum-member": 6,
    "created-at": "2025-07-18T14:50:33.66",
    "updated-at": null,
    "creator-id": "2427d29b-b64f-4315-b8b4-b0bf2f3c4cee",
    majors: [],
    "project-tags": [],
  },
];

const ProjectManagementOverview: React.FC = () => {
  const [projects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [statusFilter] = useState<string>("all");


  // Filter projects based on search query and status
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(project =>
        project["english-title"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        project["vietnamese-title"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.majors.some(major => major.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project["project-tags"].some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    return filtered;
  }, [projects, searchQuery, statusFilter]);

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      created: { variant: "secondary" as const, label: "Created" },
      ongoing: { variant: "default" as const, label: "In Progress" },
      completed: { variant: "outline" as const, label: "Completed" },
      draft: { variant: "secondary" as const, label: "Draft" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.created;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "ongoing":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "upcoming":
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get principal investigator name (mock data for now)
  const getPrincipalInvestigator = (creatorId: string) => {
    // Mock PI data - in real app, this would come from API
    const mockPIs: Record<string, string> = {
      "403c10a6-4889-49c6-b3b7-75d65572e1ee": "Dr. Nguyen Van A",
      "5439fe48-5101-4266-a10f-afabcafb2f74": "Dr. Tran Thi B",
      "2427d29b-b64f-4315-b8b4-b0bf2f3c4cee": "Dr. Le Van C",
    };
    return mockPIs[creatorId] || "Not assigned yet";
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Management Overview</h2>
          <p className="text-muted-foreground">
            View and manage all projects with expandable summaries
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects by title, code, major, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline">
            {filteredProjects.length} projects
          </Badge>
          <Badge variant="outline">
            {projects.filter(p => p.status === "created").length} active
          </Badge>
          <Badge variant="outline">
            {projects.filter(p => p.status === "completed").length} completed
          </Badge>
        </div>
      </div>

     {/* Projects List */}
<div className="space-y-4">
  {filteredProjects.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12">
      <FileText className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
      <p className="text-gray-500 text-center">
        {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first project"}
      </p>
    </div>
  ) : (
    filteredProjects.map((project) => (
      <div key={project.id} className="mb-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <Collapsible
          open={expandedProjects.has(project.id)}
          onOpenChange={() => toggleProjectExpansion(project.id)}
        >
          {/* Collapsed View - Default */}
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer hover:bg-gray-50 transition-colors p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold truncate">
                        {project["english-title"]}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {project["vietnamese-title"]}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {project.code}
                    </Badge>
                  </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>FPT University</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>PI: {getPrincipalInvestigator(project["creator-id"])}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Max {project["maximum-member"]} members</span>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {expandedProjects.has(project.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>

            {/* Expanded View - Quick Summary */}
            <CollapsibleContent>
              <div className="pt-0 border-t bg-gray-50/50 px-6 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                  {/* Milestones Overview */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Milestones Overview
                    </h4>
                    <div className="space-y-2">
                      {(mockMilestones[project.id] || []).slice(0, 3).map((milestone) => (
                        <div key={milestone.id} className="flex items-center space-x-2 text-sm">
                          {getMilestoneIcon(milestone.status)}
                          <span className="flex-1 truncate">{milestone.title}</span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(milestone.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {(mockMilestones[project.id] || []).length === 0 && (
                        <p className="text-sm text-muted-foreground">No milestones available</p>
                      )}
                      {(mockMilestones[project.id] || []).length > 3 && (
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          View All Milestones
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Documents Summary */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Documents Summary
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {(mockDocuments[project.id] || []).length} documents uploaded
                      </p>
                      {(mockDocuments[project.id] || []).slice(0, 3).map((doc) => (
                        <div key={doc.id} className="text-sm truncate">
                          📄 {doc.name}
                        </div>
                      ))}
                      {(mockDocuments[project.id] || []).length === 0 && (
                        <p className="text-sm text-muted-foreground">No documents available</p>
                      )}
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        View All Documents
                      </Button>
                    </div>
                  </div>

                  {/* Timeline & Progress */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <Folder className="w-4 h-4 mr-2" />
                      Timeline & Progress
                    </h4>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{new Date(project["created-at"]).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Language:</span>
                          <span>{project.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Members:</span>
                          <span>{project["maximum-member"]}</span>
                        </div>
                      </div>

                      {/* Majors */}
                      {project.majors.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Majors:</span>
                          <div className="flex flex-wrap gap-1">
                            {project.majors.slice(0, 2).map((major) => (
                              <Badge key={major.id} variant="secondary" className="text-xs">
                                {major.name}
                              </Badge>
                            ))}
                            {project.majors.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.majors.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {project["project-tags"].length > 0 && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Tags:</span>
                          <div className="flex flex-wrap gap-1">
                            {project["project-tags"].slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                            {project["project-tags"].length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{project["project-tags"].length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
        </Collapsible>
      </div>
    ))
  )}
</div>
    </div>
  );
};

export default ProjectManagementOverview;
