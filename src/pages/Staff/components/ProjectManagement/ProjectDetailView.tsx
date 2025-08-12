import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Users,
  UserCheck,
  Crown,
  User,
  Globe,
  Tag,
  Clock,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { LegacyProject, Council } from "./detailViewTypes";
import { CouncilAssignmentModal } from "./CouncilAssignmentModal";
import { formatDate } from "@/utils/date";
import {
  useAppraisalCouncilByProjectId,
  useUserRolesByAppraisalCouncil,
  useAssignAppraisalCouncilToProject,
} from "@/hooks/queries/appraisal-council";

interface ProjectDetailViewProps {
  selectedProject: LegacyProject | null;
  navigateToPage: (
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
  ) => void;
  onAssignCouncil?: (project: LegacyProject, council: Council) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  selectedProject,
  navigateToPage: _navigateToPage, // eslint-disable-line @typescript-eslint/no-unused-vars
  onAssignCouncil,
}) => {
  const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false);

  // API hooks for council assignment
  const { data: assignedCouncil } = useAppraisalCouncilByProjectId(
    selectedProject?.id || ""
  );

  const { data: councilMembers } = useUserRolesByAppraisalCouncil(
    assignedCouncil?.id || "",
    1,
    100
  );

  const assignCouncilMutation = useAssignAppraisalCouncilToProject();

  if (!selectedProject) return null;

  const handleAssignCouncil = (project: LegacyProject, council: Council) => {
    // Use the API to assign council
    assignCouncilMutation.mutate({
      sourceProjectId: project.id,
      appraisalCouncilId: council.id,
    });

    if (onAssignCouncil) {
      onAssignCouncil(project, council);
    }
  };

  // Mock data for project details
  // const projectDocuments = [
  //   { id: "doc-1", name: "Project Proposal", type: "proposal" },
  //   { id: "doc-2", name: "Technical Specification", type: "technical" },
  //   { id: "doc-3", name: "Budget Plan", type: "budget" },
  // ];

  // const milestones = [
  //   { id: "milestone-1", title: "Project Initiation", status: "completed" },
  //   { id: "milestone-2", title: "Research Phase", status: "in-progress" },
  //   { id: "milestone-3", title: "Development Phase", status: "pending" },
  // ];

  // const evaluations = [
  //   {
  //     id: "eval-1",
  //     title: "Initial Assessment",
  //     type: "preliminary",
  //     stages: [
  //       { id: "stage-1", name: "Proposal Review", status: "completed" },
  //       { id: "stage-2", name: "Technical Assessment", status: "in-progress" },
  //     ],
  //   },
  //   {
  //     id: "eval-2",
  //     title: "Mid-term Assessment",
  //     type: "interim",
  //     stages: [
  //       { id: "stage-3", name: "Progress Review", status: "pending" },
  //       { id: "stage-4", name: "Quality Assessment", status: "pending" },
  //     ],
  //   },
  // ];

  return (
    <div className="space-y-8 p-8">
      {/* Project Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedProject["english-title"]}
            </h1>
            <p className="text-gray-600 mt-1">
              {selectedProject["vietnamese-title"]}
            </p>
            {selectedProject.code && (
              <p className="text-sm text-gray-500 mt-1">
                Code: {selectedProject.code}
              </p>
            )}
          </div>
          <StatusBadge status={selectedProject.status} size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">ID:</span>
                <span className="ml-2 text-sm">{selectedProject.id}</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Type:</span>
                <span className="ml-2">{selectedProject.type}</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Genre:</span>
                <span className="ml-2">{selectedProject.genre}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Language:</span>
                <span className="ml-2">{selectedProject.language}</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Category:</span>
                <span className="ml-2">{selectedProject.category}</span>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Project Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Max Members:</span>
                <span className="ml-2">
                  {selectedProject["maximum-member"]}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Created:</span>
                <span className="ml-2">
                  {formatDate(selectedProject["created-at"])}
                </span>
              </div>
              {selectedProject.description && (
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProject.description}
                  </p>
                </div>
              )}
              {selectedProject["requirement-note"] && (
                <div>
                  <span className="font-medium">Requirements:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProject["requirement-note"]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Creator Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              Creator
            </h3>
            <div className="space-y-3">
              {selectedProject.creator ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      selectedProject.creator["avatar-url"] ||
                      "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg"
                    }
                    alt={selectedProject.creator["full-name"]}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";
                    }}
                  />
                  <div>
                    <p className="font-medium">
                      {selectedProject.creator["full-name"]}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedProject.creator.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Creator ID:</span>
                  <span className="ml-2">{selectedProject["creator-id"]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(selectedProject.abbreviations || selectedProject.duration) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProject.abbreviations && (
                <div className="flex items-center">
                  <span className="font-medium">Abbreviations:</span>
                  <span className="ml-2">{selectedProject.abbreviations}</span>
                </div>
              )}
              {selectedProject.duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">
                    {selectedProject.duration} months
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Council Assignment Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Council Assignment
              </h2>
              <p className="text-gray-600">
                Evaluation and oversight council for this project
              </p>
            </div>
          </div>
          {!assignedCouncil && (
            <Button
              onClick={() => setIsCouncilModalOpen(true)}
              className="flex items-center space-x-2"
              disabled={assignCouncilMutation.isPending}
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign Council</span>
            </Button>
          )}
        </div>

        {assignedCouncil ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assignedCouncil.name}
                  </h3>
                  <Badge className="bg-green-100 text-green-800">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Assigned
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Code: {assignedCouncil.code}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Council Info</span>
                </div>
                <div className="ml-6 text-sm text-gray-700">
                  <p>Status: {assignedCouncil.status}</p>
                  <p>
                    Created:{" "}
                    {new Date(
                      assignedCouncil["created-at"]
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Members{" "}
                    {councilMembers
                      ? `(${councilMembers["data-list"]?.length || 0})`
                      : ""}
                  </span>
                </div>
                <div className="ml-6 text-sm text-gray-600">
                  {councilMembers && councilMembers["data-list"] ? (
                    <>
                      {councilMembers["data-list"]
                        .slice(0, 2)
                        .map((member, index) => (
                          <span key={member.id}>
                            {member["full-name"]}
                            {index <
                              Math.min(
                                1,
                                councilMembers["data-list"]!.length - 1
                              ) && ", "}
                          </span>
                        ))}
                      {councilMembers["data-list"].length > 2 && (
                        <span>
                          {" "}
                          and {councilMembers["data-list"].length - 2} more...
                        </span>
                      )}
                    </>
                  ) : (
                    <span>Loading members...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <UserCheck className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Council Assigned
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              This project needs a council for evaluation and oversight.
            </p>
            <Button
              onClick={() => setIsCouncilModalOpen(true)}
              className="flex items-center space-x-2 mx-auto"
              disabled={assignCouncilMutation.isPending}
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {assignCouncilMutation.isPending
                  ? "Assigning..."
                  : "Assign Council"}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Project Documents Section */}
      {/* <div className="rounded-xl p-6 border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Project Documents
              </h2>
              <p className="text-gray-600">
                View and manage project documentation
              </p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {projectDocuments.length} files
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projectDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
              onClick={() => navigateToPage("document", doc)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-500">{doc.type}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Milestones Section */}
      {/* <div className="rounded-xl p-6 border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Milestones</h2>
              <p className="text-gray-600">Track project progress and phases</p>
            </div>
          </div>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {milestones.length} milestones
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer group"
              onClick={() => navigateToPage("milestone", milestone)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {milestone.title}
                    </h4>
                    <StatusBadge status={milestone.status} size="sm" />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Evaluations & Stages Section */}
      {/* <div className="rounded-xl p-6 border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Evaluations & Stages
              </h2>
              <p className="text-gray-600">
                Assessment phases and evaluation stages
              </p>
            </div>
          </div>
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
            {evaluations.length} evaluations
          </span>
        </div>

        <div className="space-y-6">
          {evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div
                className="flex items-center justify-between mb-4 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors"
                onClick={() => navigateToPage("evaluation", evaluation)}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {evaluation.title}
                    </h3>
                    <p className="text-sm text-gray-600">{evaluation.type}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                {evaluation.stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-100 transition-all cursor-pointer group"
                    onClick={() => navigateToPage("evaluation-stage", stage)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {stage.name}
                        </h4>
                        <StatusBadge status={stage.status} size="sm" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Council Assignment Modal */}
      <CouncilAssignmentModal
        isOpen={isCouncilModalOpen}
        onClose={() => setIsCouncilModalOpen(false)}
        project={selectedProject}
        onAssignCouncil={handleAssignCouncil}
      />
    </div>
  );
};

export default ProjectDetailView;
