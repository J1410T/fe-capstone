import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MessageSquare,
  Eye,
  Search,
  Building,
  User,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Project {
  id: string;
  title: string;
  pi: string;
  status: "Active" | "Completed" | "Under Review";
  department: string;
  startDate: string;
  endDate: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  progress: number;
  projectId: string;
  hostFeedback?: HostFeedback[];
  staffStatus?: "approved" | "rejected" | "pending";
  staffApprovedBy?: string;
  staffApprovedAt?: string;
  staffRejectedBy?: string;
  staffRejectedAt?: string;
  documents?: Document[];
}

interface HostFeedback {
  id: string;
  hostName: string;
  hostInstitution: string;
  feedback: string;
  status: "approved" | "rejected" | "pending";
  submittedAt: string;
  reviewer: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Drug Discovery Platform",
    pi: "Dr. Sarah Johnson",
    status: "Active",
    department: "Computer Science",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
  },
  {
    id: "2",
    title: "Sustainable Energy Storage Solutions",
    pi: "Dr. Michael Chen",
    status: "Active",
    department: "Engineering",
    startDate: "2024-02-01",
    endDate: "2025-08-01",
  },
  {
    id: "3",
    title: "Blockchain-based Supply Chain Management",
    pi: "Dr. Emily Rodriguez",
    status: "Under Review",
    department: "Business",
    startDate: "2024-03-01",
    endDate: "2025-03-01",
  },
];

const mockMilestones: Milestone[] = [
  {
    id: "1",
    title: "Project Initiation and Planning",
    description: "Define project scope, objectives, and assemble the research team",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    status: "completed",
    progress: 100,
    projectId: "1",
    hostFeedback: [
      {
        id: "1",
        hostName: "Dr. Sarah Wilson",
        hostInstitution: "Stanford Medical Center",
        feedback: "Project plan approved. All deliverables met expectations. Excellent scope definition.",
        status: "approved",
        submittedAt: "2024-03-10T14:30:00Z",
        reviewer: "Dr. Sarah Wilson",
      },
    ],
    staffStatus: "approved",
    staffApprovedBy: "Staff Admin",
    staffApprovedAt: "2024-03-16T10:30:00Z",
    documents: [
      { id: "1", name: "Project Plan.pdf", type: "PDF", size: "2.4 MB", uploadedAt: "2024-03-10" },
    ],
  },
  {
    id: "2",
    title: "Literature Review and Research",
    description: "Comprehensive review of existing literature and research methodologies",
    startDate: "2024-03-16",
    endDate: "2024-06-15",
    status: "approved",
    progress: 85,
    projectId: "1",
    hostFeedback: [
      {
        id: "2",
        hostName: "Dr. Michael Chen",
        hostInstitution: "Stanford Medical Center",
        feedback: "Literature review is comprehensive. Consider adding more recent studies from 2024.",
        status: "approved",
        submittedAt: "2024-06-10T16:20:00Z",
        reviewer: "Dr. Michael Chen",
      },
    ],
    staffStatus: "approved",
    staffApprovedBy: "Staff Admin",
    staffApprovedAt: "2024-06-16T14:20:00Z",
  },
  {
    id: "3",
    title: "Algorithm Development and Testing",
    description: "Develop core AI algorithms and conduct initial testing",
    startDate: "2024-06-16",
    endDate: "2024-09-30",
    status: "pending",
    progress: 60,
    projectId: "1",
    hostFeedback: [
      {
        id: "3",
        hostName: "Dr. Emily Rodriguez",
        hostInstitution: "Stanford Medical Center",
        feedback: "Algorithm development is on track. Please provide more detailed test results and validation data.",
        status: "pending",
        submittedAt: "2024-09-15T11:45:00Z",
        reviewer: "Dr. Emily Rodriguez",
      },
      {
        id: "4",
        hostName: "Dr. James Liu",
        hostInstitution: "Tech Innovation Lab",
        feedback: "Good progress but need more comprehensive testing before approval.",
        status: "rejected",
        submittedAt: "2024-09-18T09:30:00Z",
        reviewer: "Dr. James Liu",
      },
    ],
    staffStatus: "pending",
    documents: [
      { id: "2", name: "Algorithm Specs.pdf", type: "PDF", size: "1.8 MB", uploadedAt: "2024-09-15" },
      { id: "3", name: "Test Results.xlsx", type: "Excel", size: "856 KB", uploadedAt: "2024-09-20" },
    ],
  },
  {
    id: "4",
    title: "Final Implementation and Deployment",
    description: "Complete system implementation and prepare for deployment",
    startDate: "2024-10-01",
    endDate: "2025-01-15",
    status: "pending",
    progress: 0,
    projectId: "1",
    staffStatus: "pending",
  },
  // Project 2 milestones
  {
    id: "5",
    title: "Energy Storage Research Phase",
    description: "Research and analyze current energy storage technologies",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    status: "completed",
    progress: 100,
    projectId: "2",
    hostFeedback: [
      {
        id: "5",
        hostName: "Dr. Anna Thompson",
        hostInstitution: "Green Energy Institute",
        feedback: "Comprehensive research with excellent analysis of current technologies.",
        status: "approved",
        submittedAt: "2024-04-28T13:15:00Z",
        reviewer: "Dr. Anna Thompson",
      },
    ],
    staffStatus: "approved",
    staffApprovedBy: "Staff Admin",
    staffApprovedAt: "2024-05-02T09:00:00Z",
  },
  {
    id: "6",
    title: "Prototype Development",
    description: "Develop and test initial prototype of energy storage solution",
    startDate: "2024-05-01",
    endDate: "2024-08-01",
    status: "pending",
    progress: 75,
    projectId: "2",
    hostFeedback: [
      {
        id: "6",
        hostName: "Dr. Robert Kim",
        hostInstitution: "Green Energy Institute",
        feedback: "Prototype shows promise but needs efficiency improvements.",
        status: "pending",
        submittedAt: "2024-07-15T10:30:00Z",
        reviewer: "Dr. Robert Kim",
      },
    ],
    staffStatus: "pending",
  },
];

const StaffMilestoneManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");
  const [approvalComments, setApprovalComments] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  // Group milestones by project
  const projectsWithMilestones = useMemo(() => {
    const projectMap = new Map<string, { project: Project; milestones: Milestone[] }>();

    mockMilestones.forEach(milestone => {
      const project = mockProjects.find(p => p.id === milestone.projectId);
      if (project) {
        if (!projectMap.has(project.id)) {
          projectMap.set(project.id, { project, milestones: [] });
        }
        projectMap.get(project.id)!.milestones.push(milestone);
      }
    });

    // Sort milestones within each project by start date
    projectMap.forEach(({ milestones }) => {
      milestones.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    });

    return Array.from(projectMap.values());
  }, []);

  // Filter projects and milestones by search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projectsWithMilestones;

    return projectsWithMilestones.filter(({ project, milestones }) => {
      const projectMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.pi.toLowerCase().includes(searchTerm.toLowerCase());
      const milestoneMatch = milestones.some(milestone =>
        milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        milestone.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return projectMatch || milestoneMatch;
    });
  }, [projectsWithMilestones, searchTerm]);

  // Get milestone time category
  const getMilestoneTimeCategory = (milestone: Milestone) => {
    const currentDate = new Date();
    const startDate = new Date(milestone.startDate);
    const endDate = new Date(milestone.endDate);

    if (endDate < currentDate) {
      return "past";
    } else if (startDate <= currentDate && endDate >= currentDate) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  // Toggle project expansion
  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsViewDialogOpen(true);
  };

  const handleApprovalAction = (milestone: Milestone, action: "approve" | "reject") => {
    setSelectedMilestone(milestone);
    setApprovalAction(action);
    setApprovalComments("");
    setIsApprovalDialogOpen(true);
  };

  const handleApprovalSubmit = () => {
    if (!selectedMilestone) return;

    // Update milestone staff status
    const updatedMilestone = {
      ...selectedMilestone,
      staffStatus: approvalAction === "approve" ? "approved" : "rejected",
      [`staff${approvalAction === "approve" ? "Approved" : "Rejected"}By`]: "Current Staff Member",
      [`staff${approvalAction === "approve" ? "Approved" : "Rejected"}At`]: new Date().toISOString(),
    };

    // In a real app, this would be an API call
    console.log("Milestone updated:", updatedMilestone);

    toast.success(
      `Milestone ${approvalAction === "approve" ? "approved" : "rejected"} by staff successfully`
    );

    setIsApprovalDialogOpen(false);
    setSelectedMilestone(null);
    setApprovalComments("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Milestone Management</h1>
          <p className="text-muted-foreground">
            Review and approve project milestones across all projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Clock className="w-4 h-4 mr-1" />
            {mockMilestones.filter(m => m.staffStatus === "pending").length} Pending
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <CheckCircle className="w-4 h-4 mr-1" />
            {mockMilestones.filter(m => m.staffStatus === "approved").length} Approved
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects or milestones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects and Milestones */}
      <div className="space-y-4">
        {filteredProjects.map(({ project, milestones }) => {
          const isExpanded = expandedProjects.has(project.id);
          const pendingCount = milestones.filter(m => m.staffStatus === "pending").length;
          const approvedCount = milestones.filter(m => m.staffStatus === "approved").length;

          return (
            <Card key={project.id}>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleProject(project.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{project.pi}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{project.department}</span>
                        </div>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-gray-50 text-gray-700">
                        {milestones.length} milestone{milestones.length !== 1 ? 's' : ''}
                      </Badge>
                      {pendingCount > 0 && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {pendingCount} pending
                        </Badge>
                      )}
                      {approvedCount > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {approvedCount} approved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Collapsible Milestones Section */}
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {milestones.map((milestone) => {
                      const timeCategory = getMilestoneTimeCategory(milestone);
                      return (
                        <div
                          key={milestone.id}
                          className={`border rounded-lg p-4 ${
                            timeCategory === "past" ? "bg-gray-50" :
                            timeCategory === "upcoming" ? "bg-gray-50 opacity-75" :
                            "bg-white"
                          }`}
                        >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{milestone.title}</h3>
                            <Badge
                              variant="outline"
                              className={
                                timeCategory === "past" ? "bg-gray-100 text-gray-700" :
                                timeCategory === "current" ? "bg-blue-100 text-blue-700" :
                                "bg-yellow-100 text-yellow-700"
                              }
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              {timeCategory === "past" ? "Past" :
                               timeCategory === "current" ? "Current" : "Upcoming"}
                            </Badge>
                            {milestone.staffStatus && (
                              <Badge className={getStatusColor(milestone.staffStatus)}>
                                {getStatusIcon(milestone.staffStatus)}
                                <span className="ml-1 capitalize">Staff {milestone.staffStatus}</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{milestone.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>Start: {new Date(milestone.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>End: {new Date(milestone.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                              <span>Progress: {milestone.progress}%</span>
                            </div>
                          </div>

                          {/* Host Institution Feedback */}
                          {milestone.hostFeedback && milestone.hostFeedback.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center space-x-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Host Institution Feedback</span>
                              </div>
                              <div className="space-y-3">
                                {milestone.hostFeedback.map((feedback) => (
                                  <div key={feedback.id} className="border-l-4 border-gray-300 pl-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-sm">{feedback.hostName}</span>
                                        <Badge
                                          variant="outline"
                                          className={
                                            feedback.status === "approved" ? "bg-green-100 text-green-700" :
                                            feedback.status === "rejected" ? "bg-red-100 text-red-700" :
                                            "bg-yellow-100 text-yellow-700"
                                          }
                                        >
                                          {feedback.status === "approved" ? (
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                          ) : feedback.status === "rejected" ? (
                                            <XCircle className="w-3 h-3 mr-1" />
                                          ) : (
                                            <Clock className="w-3 h-3 mr-1" />
                                          )}
                                          {feedback.status}
                                        </Badge>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {new Date(feedback.submittedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{feedback.feedback}</p>
                                    <p className="text-xs text-gray-500">{feedback.hostInstitution}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(milestone)}
                            className="h-8 px-3"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>

                          {/* Only show approval buttons if not already approved/rejected by staff */}
                          {milestone.staffStatus === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprovalAction(milestone, "approve")}
                                className="h-8 px-3 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleApprovalAction(milestone, "reject")}
                                className="h-8 px-3"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No projects found</p>
                <p>Try adjusting your search terms or check back later.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>



      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Milestone Details</span>
            </DialogTitle>
            <DialogDescription>
              Detailed information about the selected milestone
            </DialogDescription>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMilestone.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedMilestone.status)}>
                      {getStatusIcon(selectedMilestone.status)}
                      <span className="ml-1 capitalize">{selectedMilestone.status}</span>
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedMilestone.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">End Date</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedMilestone.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMilestone.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Progress</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedMilestone.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{selectedMilestone.progress}%</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Documents */}
              {selectedMilestone.documents && selectedMilestone.documents.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Documents</Label>
                  <div className="space-y-2">
                    {selectedMilestone.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.type} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Host Institution Feedback */}
              {selectedMilestone.hostFeedback && selectedMilestone.hostFeedback.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Host Institution Feedback</Label>
                  <div className="space-y-3">
                    {selectedMilestone.hostFeedback.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{feedback.hostName}</span>
                            <Badge
                              variant="outline"
                              className={
                                feedback.status === "approved" ? "bg-green-100 text-green-700" :
                                feedback.status === "rejected" ? "bg-red-100 text-red-700" :
                                "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {feedback.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(feedback.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{feedback.feedback}</p>
                        <p className="text-xs text-gray-500">{feedback.hostInstitution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Status */}
              {selectedMilestone.staffStatus && selectedMilestone.staffStatus !== "pending" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Staff Decision</Label>
                  <div className={`p-4 border rounded-lg ${
                    selectedMilestone.staffStatus === "approved" ? "bg-green-50" : "bg-red-50"
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedMilestone.staffStatus === "approved" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium text-sm capitalize">
                        {selectedMilestone.staffStatus} by Staff
                      </span>
                    </div>
                    {selectedMilestone.staffApprovedBy && (
                      <p className="text-xs text-gray-500">
                        By {selectedMilestone.staffApprovedBy} on{" "}
                        {selectedMilestone.staffApprovedAt && new Date(selectedMilestone.staffApprovedAt).toLocaleDateString()}
                      </p>
                    )}
                    {selectedMilestone.staffRejectedBy && (
                      <p className="text-xs text-gray-500">
                        By {selectedMilestone.staffRejectedBy} on{" "}
                        {selectedMilestone.staffRejectedAt && new Date(selectedMilestone.staffRejectedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {approvalAction === "approve" ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span>
                {approvalAction === "approve" ? "Approve" : "Reject"} Milestone
              </span>
            </DialogTitle>
            <DialogDescription>
              {approvalAction === "approve"
                ? "Approve this milestone and provide feedback to the project team."
                : "Reject this milestone and provide feedback for improvements."}
            </DialogDescription>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Milestone</Label>
                <p className="mt-1 text-sm text-gray-900">{selectedMilestone.title}</p>
              </div>
              <div>
                <Label htmlFor="approval-comments" className="text-sm font-medium text-gray-700">
                  Comments {approvalAction === "reject" && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id="approval-comments"
                  placeholder={
                    approvalAction === "approve"
                      ? "Provide feedback or comments (optional)..."
                      : "Please explain why this milestone is being rejected..."
                  }
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApprovalDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprovalSubmit}
              className={
                approvalAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              disabled={approvalAction === "reject" && !approvalComments.trim()}
            >
              {approvalAction === "approve" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Milestone
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Milestone
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffMilestoneManagement;
