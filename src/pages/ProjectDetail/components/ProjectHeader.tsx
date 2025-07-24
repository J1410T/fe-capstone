import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { getStatusColor } from "../utils/statusHelpers";
import { ArrowLeft, User } from "lucide-react";

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
  isMember,
  roleInProject,
  pictureUrl,
  englishTitle,
  code,
  creator,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getBackPath = () => {
    switch (user?.role) {
      case UserRole.PRINCIPAL_INVESTIGATOR:
        return "/pi/projects";
      case UserRole.HOST_INSTITUTION:
        return "/host/my-projects";
      case UserRole.RESEARCHER:
        return "/researcher/projects";
      case UserRole.APPRAISAL_COUNCIL:
        return "/council/projects";
      default:
        return "/home";
    }
  };

  const handleBack = () => {
    navigate(getBackPath());
  };

  // Props are available for future use
  console.log("isMember:", isMember, "roleInProject:", roleInProject);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={
            pictureUrl ||
            "https://wx4.sinaimg.cn/large/005D0pgely1i3dp60wdiaj32dc3k0nph.jpg"
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
