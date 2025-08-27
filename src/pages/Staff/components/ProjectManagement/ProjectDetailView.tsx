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
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { LegacyProject, Council } from "../../../../types/detailViewTypes";
import { CouncilAssignmentModal } from "./CouncilAssignmentModal";
import { formatDate } from "@/utils/date";
import {
  useAppraisalCouncilByProjectId,
  useUserRolesByAppraisalCouncil,
  useAssignAppraisalCouncilToProject,
} from "@/hooks/queries/appraisal-council";
import { filterMembersForDisplay } from "@/utils/appraisal-council-roles";
import {
  useProjectResult,
  type ResultPublish,
} from "@/hooks/queries/projectResult";
import { formatDateTime } from "@/utils";

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

// Read-only Project Results Component for Staff
const StaffProjectResults: React.FC<{
  projectId: string;
  category: string;
}> = ({ projectId, category }) => {
  const { data: projectResultResponse } = useProjectResult(projectId);
  const projectResult = projectResultResponse?.success
    ? projectResultResponse.data
    : null;

  const categoryLower = category?.toLowerCase() || "";
  const isBasicCategory = categoryLower === "basic";
  const isApplicationCategory =
    categoryLower === "application" ||
    categoryLower === "implementation" ||
    categoryLower.includes("application") ||
    categoryLower.includes("implementation");

  if (!projectResult) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">No project results found</p>
        <p className="text-sm text-muted-foreground">
          This project doesn't have any results or deliverables yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Result */}
      <div className="space-y-4">
        <div className="flex items-start justify-between p-4 border rounded-lg bg-green-50">
          <div className="flex items-start gap-3">
            {isApplicationCategory ? (
              <FileText className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <ExternalLink className="h-5 w-5 text-green-600 mt-0.5" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {projectResult.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Added: {formatDateTime(projectResult["added-date"])}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {projectResult.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(projectResult.url!, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {isApplicationCategory ? "Download" : "View"}
                  </Button>
                )}
                {!projectResult.url && isBasicCategory && (
                  <p className="text-sm text-amber-600">
                    No URL provided for this result
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publications (Only for Basic category) */}
      {isBasicCategory &&
        projectResult["result-publishs"] &&
        projectResult["result-publishs"].length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Publications</h3>
            <div className="space-y-3">
              {projectResult["result-publishs"]?.map(
                (publish: ResultPublish, index: number) => (
                  <div
                    key={publish.id || index}
                    className="p-4 border rounded-lg bg-blue-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {publish.title}
                        </h4>
                        {publish.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {publish.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Publisher: {publish.publisher}</span>
                          <span>
                            Date:{" "}
                            {new Date(
                              publish["publication-date"] || ""
                            ).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {publish["access-type"]}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(publish.url || "", "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* No Publications for Basic category */}
      {isBasicCategory &&
        (!projectResult["result-publishs"] ||
          projectResult["result-publishs"].length === 0) && (
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium mb-1">No publications found</p>
            <p className="text-xs text-muted-foreground">
              This project result doesn't have any publications yet.
            </p>
          </div>
        )}
    </div>
  );
};

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

  // Check if creator is staff
  const isCreatorStaff =
    selectedProject.creator?.["full-name"]?.toLowerCase() === "staff";

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

  const filteredMembers = councilMembers?.["data-list"]
    ? filterMembersForDisplay(councilMembers["data-list"])
    : [];

  // Separate chairman and other members
  const chairman = filteredMembers.find((member) => member.name === "Chairman");
  const otherMembers = filteredMembers.filter(
    (member) => member.name !== "Chairman"
  );

  const defaultAvatar =
    "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";

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
          <div className="md:col-span-1">
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
            <h3 className="text-lg font-semibold mb-3 flex items-center mt-8">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              Creator
            </h3>
            <div className="space-y-3">
              {selectedProject.creator ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedProject.creator["avatar-url"] || defaultAvatar}
                    alt={selectedProject.creator["full-name"]}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                  <div>
                    <p className="font-medium">
                      {selectedProject.creator["full-name"]}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedProject.creator.email}
                    </p>
                    {isCreatorStaff && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                        Staff Creator
                      </Badge>
                    )}
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

          {/* Project Details */}
          <div className="md:col-span-2">
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
          {/* <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-500" />
              Creator
            </h3>
            <div className="space-y-3">
              {selectedProject.creator ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedProject.creator["avatar-url"] || defaultAvatar}
                    alt={selectedProject.creator["full-name"]}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
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
          </div> */}
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
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Members{" "}
                    {councilMembers
                      ? `(${councilMembers["data-list"]?.length || 0})`
                      : ""}
                  </span>
                </div>
                <div className="ml-6 space-y-2">
                  {councilMembers && councilMembers["data-list"] ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Chairman on the left */}
                      {chairman && (
                        <div className=" p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">
                              Chairman
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <img
                              src={chairman["avatar-url"] || defaultAvatar}
                              alt={chairman["full-name"]}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = defaultAvatar;
                              }}
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {chairman["full-name"]}
                              </p>
                              <p className="text-xs text-gray-500">
                                {chairman.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other members on the right */}
                      {otherMembers && otherMembers.length > 0 && (
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">
                              Council Members
                            </span>
                          </div>
                          <div className="space-y-2">
                            {otherMembers.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center space-x-3"
                              >
                                <img
                                  src={member["avatar-url"] || defaultAvatar}
                                  alt={member["full-name"]}
                                  className="w-8 h-8 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = defaultAvatar;
                                  }}
                                />
                                <div>
                                  <p className="font-medium text-sm">
                                    {member["full-name"]}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {member.email}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-600">
                      Loading members...
                    </span>
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

      {/* Project Results Section - Only show if creator is staff (Read-only) */}
      {isCreatorStaff && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Project Results (Read-only)
              </h2>
              <p className="text-gray-600">
                Project deliverables and publications - Staff view only
              </p>
            </div>
          </div>

          <StaffProjectResults
            projectId={selectedProject.id}
            category={selectedProject.category}
          />
        </div>
      )}

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
