import React from "react";
import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Tag, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  // Common fields
  id: string | number;
  title: string;
  progress: number;
  status: string;

  // Optional fields for different use cases (kept for backward compatibility)
  category?: string;
  description?: string;
  updatedAt?: string;
  teamMembers?: number;
  manager?: string;
  pi?: string;
  department?: string;
  year?: string;
  budget?: string;
  type?: string; // Added for project type (Application/Fundamental)

  // Callback functions
  onViewDetails?: (projectId: string | number) => void;
  getStatusColor?: (status: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  status,
  type,
  category,
  description,
  onViewDetails,
  getStatusColor,
}) => {
  const { user } = useAuth();

  // Only show projects with "done" or "created" status
  const allowedStatuses = ["done", "created"];
  if (!allowedStatuses.includes(status.toLowerCase())) {
    return null;
  }

  // Determine the correct route based on user role
  const getProjectDetailRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      return `/pi/project/${id}`;
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      return `/host/project/${id}`;
    } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
      return `/council/project/${id}`;
    } else {
      // Default to regular project details
      return `/project/${id}`;
    }
  };

  // Default status color function if not provided
  const defaultGetStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "in progress":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200";
      case "completed":
      case "done":
        return "bg-blue-100 text-blue-800 border-blue-300 ring-1 ring-blue-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300 ring-1 ring-amber-200";
      case "on hold":
        return "bg-orange-100 text-orange-800 border-orange-300 ring-1 ring-orange-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-300 ring-1 ring-green-200";
      case "submitted":
        return "bg-indigo-100 text-indigo-800 border-indigo-300 ring-1 ring-indigo-200";
      case "created":
        return "bg-purple-100 text-purple-800 border-purple-300 ring-1 ring-purple-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-300 ring-1 ring-gray-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 ring-1 ring-slate-200";
    }
  };

  const statusColorClass = getStatusColor
    ? getStatusColor(status)
    : defaultGetStatusColor(status);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  // Transform status display text
  const getDisplayStatus = (status: string) => {
    if (status.toLowerCase() === "created") {
      return "Open";
    }
    return status;
  };

  return (
    <Card className="group h-full flex flex-col bg-white border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
      {/* Compact Header Section */}
      <CardHeader className="p-4 pb-2">
        <div className="space-y-2">
          {/* Title and Status Row */}
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug flex-1 group-hover:text-emerald-900 transition-colors">
              {title}
            </CardTitle>
            <Badge
              className={`${statusColorClass} text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0`}
            >
              {getDisplayStatus(status)}
            </Badge>
          </div>

          {/* Metadata Tags */}
          {(category || type) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {category && (
                <div className="flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1">
                  <Building2 className="h-3 w-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {category}
                  </span>
                </div>
              )}
              {type && (
                <div className="flex items-center gap-1 bg-emerald-50 rounded-md px-2 py-1">
                  <Tag className="h-3 w-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    {type}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      {/* Compact Content Section */}
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        {description && (
          <div className="mb-3 flex-1">
            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end mt-auto">
          {onViewDetails ? (
            <Button
              onClick={handleViewDetails}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 h-7 text-xs group/btn"
            >
              View Details
              <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          ) : (
            <Link to={getProjectDetailRoute()}>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 h-7 text-xs group/btn"
              >
                View Details
                <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>

      {/* Subtle border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Card>
  );
};

// Backward compatibility - keep the old interface but use new formal layout
interface UserProjectCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  updatedAt: string;
  teamMembers: number;
  manager: string;
  progress: number;
  status: string;
  type?: string;
}

const UserProjectCard: React.FC<UserProjectCardProps> = (props) => {
  return <ProjectCard {...props} />;
};

export default ProjectCard;
export { UserProjectCard };
