import React from "react";
import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  Calendar,
  ChevronRight,
  DollarSign,
  User,
} from "lucide-react";

interface ProjectCardProps {
  // Common fields
  id: string | number;
  title: string;
  progress: number;
  status: string;

  // Optional fields for different use cases
  category?: string;
  description?: string;
  updatedAt?: string;
  teamMembers?: number;
  manager?: string;
  pi?: string;
  department?: string;
  year?: string;
  budget?: string;

  // Callback functions
  onViewDetails?: (projectId: string | number) => void;
  getStatusColor?: (status: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  progress,
  status,
  category,
  description,
  updatedAt,
  teamMembers,
  manager,
  pi,
  department,
  year,
  budget,
  onViewDetails,
  getStatusColor,
}) => {
  const { user } = useAuth();

  // Determine the correct route based on user role
  const getProjectDetailRoute = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      return `/pi/project/${id}`;
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      return `/host/project/${id}`;
    } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
      return `/council/project/${id}`;
    } else {
      // Default to member project details for other roles
      return `/member/project/${id}`;
    }
  };

  // Default status color function if not provided
  const defaultGetStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "completed":
        return "text-indigo-700 border-indigo-200 bg-indigo-50";
      case "pending":
        return "text-yellow-700 border-yellow-200 bg-yellow-50";
      case "on hold":
        return "text-orange-700 border-orange-200 bg-orange-50";
      default:
        return "text-gray-700 border-gray-200 bg-gray-50";
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

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
          <Badge variant="outline" className={statusColorClass}>
            {status}
          </Badge>
        </div>
        {category && (
          <Badge
            variant="secondary"
            className="w-fit text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
          >
            {category}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="space-y-3">
          {/* PI or Manager */}
          {(pi || manager) && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{pi ? `PI: ${pi}` : `Manager: ${manager}`}</span>
            </div>
          )}

          {/* Department */}
          {department && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Department: {department}</span>
            </div>
          )}

          {/* Team Members */}
          {teamMembers && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{teamMembers} team members</span>
            </div>
          )}

          {/* Year or Updated Date */}
          {(year || updatedAt) && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{year ? `Year: ${year}` : `Updated ${updatedAt}`}</span>
            </div>
          )}

          {/* Budget */}
          {budget && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Budget: {budget}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {onViewDetails ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="w-full"
          >
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Link to={getProjectDetailRoute()} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

// Backward compatibility - keep the old interface
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
}

const UserProjectCard: React.FC<UserProjectCardProps> = (props) => {
  return <ProjectCard {...props} />;
};

export default UserProjectCard;
export { ProjectCard };
