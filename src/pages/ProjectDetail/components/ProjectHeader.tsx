import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "../utils/statusHelpers";
import { ArrowLeft, User } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProjectHeaderProps {
  title: string;
  status: string;
  isMember: boolean;
  roleInProject: string[];
  pictureUrl?: string | null;
  englishTitle: string;
  code?: string;
  creator?: {
    name: string | null;
  } | null;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  status,
  pictureUrl,
  englishTitle,
  code,
  creator,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      navigate("/pi/my-projects");
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      navigate("/host/my-projects");
    } else if (user?.role === UserRole.RESEARCHER) {
      navigate("/researcher/projects");
    } else {
      navigate("/projects");
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={
            pictureUrl ||
            "https://images.wallpaperscraft.com/image/single/project_model_structure_177208_1920x1080.jpg"
          }
          alt={englishTitle}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Project info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  {englishTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {code && (
                    <Badge
                      variant="outline"
                      className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                    >
                      {code}
                    </Badge>
                  )}
                  <Badge
                    className={`${getStatusColor(status)} backdrop-blur-sm`}
                  >
                    {status}
                  </Badge>
                  {creator?.name && (
                    <Badge
                      variant="outline"
                      className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                    >
                      <User className="w-3 h-3 mr-1" />
                      {creator.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section with better spacing */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
