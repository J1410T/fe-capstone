import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Building2,
  Users,
  GitBranch,
  Eye,
  UserCheck,
  FileText,
  Calendar,
  Settings,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { MilestoneCard } from "./MilestoneCard";
import {
  Project,
  ProjectClone,
  EnhancedMilestone,
  ProjectDocument,
} from "./types";

interface ProjectHierarchyCardProps {
  project: Project;
  clones: ProjectClone[];
  milestones: EnhancedMilestone[];
  documents: ProjectDocument[];
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenSidePanel: (
    type:
      | "proposal"
      | "clone"
      | "evaluation"
      | "request"
      | "milestone"
      | "council"
      | "project",
    data: unknown
  ) => void;
  getPrincipalInvestigator: (creatorId: string) => string;
  onAssignCouncil?: (projectId: string) => void;
  onApproveMilestone?: (milestoneId: string) => void;
  onRejectMilestone?: (milestoneId: string) => void;
}

export const ProjectHierarchyCard: React.FC<ProjectHierarchyCardProps> = ({
  project,
  clones,
  milestones,
  documents,
  expanded,
  onToggleExpand,
  onOpenSidePanel,
  getPrincipalInvestigator,
  onAssignCouncil,
  onApproveMilestone,
  onRejectMilestone,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* Main Project Row */}
      <div
        className="cursor-pointer hover:bg-gray-50 transition-colors p-6"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {project["english-title"]}
                </h3>
                <p className="text-base text-gray-600 truncate mt-1">
                  {project["vietnamese-title"]}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 text-sm px-3 py-1">
                {project.code}
              </Badge>
            </div>

            <div className="flex items-center space-x-6 text-base text-gray-600">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>FPT University</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>
                  PI: {getPrincipalInvestigator(project["creator-id"])}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5" />
                <span>{clones.length} clones</span>
              </div>
              <StatusBadge status={project.status} type="project" size="md" />
            </div>

            {/* Council Assignment Status */}
            {project.council && (
              <div className="mt-3 flex items-center space-x-2 text-base text-green-700">
                <UserCheck className="w-5 h-5" />
                <span>Council: {project.council}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 ml-6">
            {/* Council Assignment Button - Only show if no council assigned */}
            {!project.council && (
              <Button
                variant="default"
                size="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssignCouncil?.(project.id);
                }}
                className="text-sm px-4 py-2"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Assign Council
              </Button>
            )}

            <Button
              variant="ghost"
              size="default"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSidePanel("proposal", { ...project, type: "project" });
              }}
              className="text-sm px-4 py-2"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>

            <Button
              variant="ghost"
              size="default"
              onClick={(e) => {
                e.stopPropagation();
                // Open project settings
              }}
              className="text-sm px-4 py-2"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {expanded ? (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronRight className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Hierarchical Content */}
      {expanded && (
        <div className="border-t bg-gray-50/30">
          {/* Project Documents and Milestones */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Documents */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Project Documents ({documents.length})
                </h4>
                <div className="space-y-3">
                  {documents.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        onOpenSidePanel("proposal", {
                          ...doc,
                          type: "document",
                        })
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="truncate text-base font-medium">
                          {doc.name}
                        </span>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <p className="text-base text-gray-500">
                      No documents available
                    </p>
                  )}
                  {documents.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm"
                      onClick={() =>
                        onOpenSidePanel("project", {
                          ...project,
                          viewType: "documents",
                          allDocuments: documents,
                        })
                      }
                    >
                      View All {documents.length} Documents
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Milestones */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Milestones ({milestones.length})
                </h4>
                <div className="space-y-3">
                  {milestones.slice(0, 2).map((milestone) => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      onOpenSidePanel={onOpenSidePanel}
                      onApprove={onApproveMilestone}
                      onReject={onRejectMilestone}
                    />
                  ))}
                  {milestones.length === 0 && (
                    <p className="text-base text-gray-500">
                      No milestones available
                    </p>
                  )}
                  {milestones.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm"
                      onClick={() =>
                        onOpenSidePanel("project", {
                          ...project,
                          viewType: "milestones",
                          allMilestones: milestones,
                        })
                      }
                    >
                      View All {milestones.length} Milestones
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Clones */}
          {clones.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <GitBranch className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-base">No clones available for this project</p>
            </div>
          ) : (
            <div className="space-y-0">
              {clones.map((clone) => (
                <div
                  key={clone.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="p-4 pl-8 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <GitBranch className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <h5 className="text-lg font-semibold text-gray-900">
                              {clone.name}
                            </h5>
                            <div className="flex items-center space-x-6 text-base text-gray-600 mt-1">
                              <span>
                                Created:{" "}
                                {new Date(clone.createdAt).toLocaleDateString()}
                              </span>
                              {clone.council && (
                                <span>Council: {clone.council}</span>
                              )}
                              <span>{clone.proposals.length} proposals</span>
                              <span>
                                {clone.evaluations.length} evaluations
                              </span>
                            </div>
                          </div>
                          <StatusBadge
                            status={clone.status}
                            type="clone"
                            size="md"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="default"
                          onClick={() => onOpenSidePanel("clone", clone)}
                          className="text-sm px-4 py-2"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Clone
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
