import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Users, Tag } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { LegacyProject } from "./detailViewTypes";

// Utility function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    return dateString; // Return original if error
  }
};

interface SimpleProjectCardProps {
  project: LegacyProject;
  onViewDetails: () => void;
}

export const SimpleProjectCard: React.FC<SimpleProjectCardProps> = ({
  project,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      {/* Header with title and status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 break-words">
            {project["english-title"]}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 break-words">
            {project["vietnamese-title"]}
          </p>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={project.status} size="sm" />
        </div>
      </div>

      {/* Project details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">Type: {project.type}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            Max Members: {project["maximum-member"]}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            Created: {formatDate(project["created-at"])}
          </span>
        </div>
      </div>

      {/* Footer with tags and button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
            {project.language}
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded whitespace-nowrap">
            {project.category === "application/implementation"
              ? "application"
              : project.category}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="flex items-center justify-center space-x-1 w-full sm:w-auto flex-shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden xs:inline">View Details</span>
          <span className="xs:hidden">View</span>
        </Button>
      </div>
    </div>
  );
};

export default SimpleProjectCard;
