import React from "react";
import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
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

  // const isAllowed = ["done", "created", "draft"].includes(status.toLowerCase());
  // if (!isAllowed) return null;

  const getProjectDetailRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR)
      return `/pi/project/${id}`;
    if (user?.role === UserRole.HOST_INSTITUTION) return `/host/project/${id}`;
    if (user?.role === UserRole.APPRAISAL_COUNCIL)
      return `/council/project/${id}`;
    return `/project/${id}`;
  };

  const defaultGetStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (["created", "draft", "done"].includes(lowerStatus)) {
      return "bg-purple-100 text-purple-800 border-purple-300";
    }
    return "bg-purple-100 text-purple-800 border-purple-300";
  };

  const statusColorClass = getStatusColor
    ? getStatusColor(status)
    : defaultGetStatusColor(status);

  const getDisplayStatus = (status: string) => {
    if (["created", "draft", "done"].includes(status.toLowerCase())) {
      return "Open";
    }
    return status;
  };

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

  // Array of available icons from public/images
  const availableIcons = [
    "/images/Icon 1.png",
    "/images/Icon 3.png",
    "/images/Icon 4.png",
    "/images/Icon 9.png",
    "/images/Icon 11.png",
    "/images/Icon 14.png",
    "/images/Icon 16.png",
    "/images/Icon 20.png",
    "/images/Icon 21.png",
    "/images/Icon 22.png",
    "/images/Icon 23.png",
    "/images/Icon 24.png",
    "/images/Icon 28.png",
    "/images/Icon 29.png",
    "/images/Icon 30.png",
    "/images/Icon 31.png",
  ];

  // Generate consistent random icon based on project ID
  const getRandomIcon = (projectId: string) => {
    const hash = projectId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % availableIcons.length;
    return availableIcons[index];
  };

  const fallbackLogo = getRandomIcon(id);

  return (
    <Card className="py-0 gap-1 relative group w-full max-w-sm flex-col bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Header Section */}
      <div className="p-4">
        {/* Top Row: Logo and Status */}
        <div className="flex items-center justify-between mb-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 border border-emerald-100 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
              <img
                src={logoUrl || fallbackLogo}
                alt={title}
                className="w-10 h-10 object-contain rounded-lg"
                onError={(e) => {
                  const fallback = fallbackLogo;
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            className={`${statusColorClass} font-semibold text-xs px-2 py-0.5 rounded-full`}
          >
            {getDisplayStatus(status)}
          </Badge>
        </div>

        {/* Title Section */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
            {title}
          </h3>
          {vietnameseTitle && (
            <p className="text-xs text-gray-500 line-clamp-1">
              {vietnameseTitle}
            </p>
          )}
        </div>
      </div>

      <CardContent className="px-4 pb-3 flex-1 space-y-3">
        {/* Type & Category */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          {/* Left side: type + category */}
          <div className="flex flex-wrap gap-2">
            {type && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-2 py-0.5 rounded-full text-xs"
              >
                {type}
              </Badge>
            )}
            {category && (
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 font-medium px-2 py-0.5 rounded-full text-xs"
              >
                {category}
              </Badge>
            )}
          </div>

          {/* Right side: Enrolled */}
          {status.toLowerCase() === "draft" && (
            <div className="flex items-center gap-1 text-xs text-green-700 font-semibold">
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5" />
              </div>
              Enrolled
            </div>
          )}
        </div>

        {/* Major & Field */}
        {major && major.length > 0 && (
          <div className="text-xs bg-gray-50 rounded-lg p-2 space-y-1">
            {/* Majors */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <GraduationCap className="w-2.5 h-2.5 text-emerald-600" />
              </div>
              <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                Majors:
              </span>
              <span className="text-gray-600 text-xs">
                {major.map((m) => m.name).join(", ")}
              </span>
            </div>

            {/* Fields */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Lightbulb className="w-2.5 h-2.5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                Field
                {Array.from(new Set(major.map((m) => m.field.name))).length > 1
                  ? "s"
                  : ""}
                :
              </span>
              <span className="text-gray-600 text-xs">
                {[...new Set(major.map((m) => m.field.name))].join(", ")}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors rounded-full font-medium"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium"
              >
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">{renderActionButton()}</CardFooter>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Card>
  );
};

export default ProjectCard;
