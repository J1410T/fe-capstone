import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, User } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { LegacyProject } from "./detailViewTypes";

interface SimpleProjectCardProps {
  project: LegacyProject;
  onViewDetails: () => void;
}

// Get principal investigator name
const getPrincipalInvestigator = (creatorId: string) => {
  const piMapping: Record<string, string> = {
    "user-001": "Dr. Sarah Johnson",
    "user-002": "Prof. Michael Chen",
    "user-003": "Dr. Emily Rodriguez",
    "user-004": "Prof. James Wilson",
    "user-005": "Dr. Lisa Brown",
  };
  return piMapping[creatorId] || "Unknown PI";
};

export const SimpleProjectCard: React.FC<SimpleProjectCardProps> = ({
  project,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project["english-title"]}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {project["vietnamese-title"]}
          </p>
        </div>
        <StatusBadge status={project.status} size="sm" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>PI: {getPrincipalInvestigator(project["creator-id"])}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Created: {project["created-at"]}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {project.language}
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            {project.category}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </Button>
      </div>
    </div>
  );
};

export default SimpleProjectCard;
