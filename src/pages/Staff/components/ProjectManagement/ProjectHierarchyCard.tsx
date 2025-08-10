import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
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
  onNavigateToPage: (
    type:
      | "proposal"
      | "clone"
      | "evaluation"
      | "request"
      | "milestone"
      | "council"
      | "project"
      | "document",
    data: unknown
  ) => void;
  getPrincipalInvestigator: (creatorId: string) => string;
}

export const ProjectHierarchyCard: React.FC<ProjectHierarchyCardProps> = ({
  project,
  clones,
  milestones,
  documents,
  onNavigateToPage,
  getPrincipalInvestigator,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* Main Project Row */}
      <div className="p-6">
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
              <StatusBadge status={project.status} size="md" />
            </div>

            {/* Additional Project Information */}
            <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Progress:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span>{project.progress}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Milestones:</span>
                <span>{milestones.length} total</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Documents:</span>
                <span>{documents.length} files</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Created:</span>
                <span>
                  {new Date(project["created-at"]).toLocaleDateString()}
                </span>
              </div>
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
            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                onNavigateToPage("project", { ...project, type: "project" });
              }}
              className="text-sm px-4 py-2"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>

            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                // Open project settings
              }}
              className="text-sm px-4 py-2"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="border-t bg-gray-50/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <button
              onClick={() =>
                onNavigateToPage("project", {
                  ...project,
                  viewType: "documents",
                  allDocuments: documents,
                })
              }
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{documents.length} Documents</span>
            </button>
            <button
              onClick={() =>
                onNavigateToPage("project", {
                  ...project,
                  viewType: "milestones",
                  allMilestones: milestones,
                })
              }
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{milestones.length} Milestones</span>
            </button>
            <button
              onClick={() =>
                onNavigateToPage("project", {
                  ...project,
                  viewType: "clones",
                  allClones: clones,
                })
              }
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              <span>{clones.length} Clones</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
