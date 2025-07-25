import React from "react";
import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProjectCardProps } from "@/types/project";

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  vietnameseTitle,
  status,
  type,
  category,
  tags = [],
  logoUrl,
  major,
  onViewDetails,
  getStatusColor,
}) => {
  const { user } = useAuth();

  const allowedStatuses = ["done", "created"];
  if (!allowedStatuses.includes(status.toLowerCase())) return null;

  const getProjectDetailRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR)
      return `/pi/project/${id}`;
    if (user?.role === UserRole.HOST_INSTITUTION) return `/host/project/${id}`;
    if (user?.role === UserRole.APPRAISAL_COUNCIL)
      return `/council/project/${id}`;
    return `/project/${id}`;
  };

  const defaultGetStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "created":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const statusColorClass = getStatusColor
    ? getStatusColor(status)
    : defaultGetStatusColor(status);

  const getDisplayStatus = (status: string) =>
    status.toLowerCase() === "created" ? "Open" : status;

  const renderActionButton = () => {
    const buttonClass =
      "bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 text-sm transition-colors";

    if (onViewDetails) {
      return (
        <Button
          onClick={() => onViewDetails(id)}
          size="sm"
          className={buttonClass}
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      );
    }

    return (
      <Link to={getProjectDetailRoute()}>
        <Button size="sm" className={buttonClass}>
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    );
  };

  return (
    <Card className="p-0 relative group w-full max-w-sm flex-col bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={
              logoUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC_XtryB5OYUluF6iPg1reZRvaoFczfSOtog&s"
            }
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const fallback =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC_XtryB5OYUluF6iPg1reZRvaoFczfSOtog&s";
              if (e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              }
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              className={`${statusColorClass} font-medium text-xs px-2 py-0.5`}
            >
              {getDisplayStatus(status)}
            </Badge>
          </div>

          {/* Title & Subtitle */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-base font-semibold text-white leading-tight line-clamp-2">
              {title}
            </h3>
            {vietnameseTitle && (
              <p className="text-xs text-gray-200 line-clamp-1">
                {vietnameseTitle}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 space-y-3">
        {/* Type & Category */}
        <div className="flex flex-wrap gap-2">
          {type && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {type}
            </Badge>
          )}
          {category && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {category}
            </Badge>
          )}
        </div>

        {/* Major & Field */}
        {major && major.length > 0 && (
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">
                <strong>Major:</strong>
              </span>
              <span className="text-gray-600">{major[0]?.name}</span>
            </div>
            {major[0]?.field?.name && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  <strong>Field:</strong>
                </span>
                <span className="text-gray-600">{major[0].field.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600"
              >
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">{renderActionButton()}</CardFooter>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Card>
  );
};

export default ProjectCard;
