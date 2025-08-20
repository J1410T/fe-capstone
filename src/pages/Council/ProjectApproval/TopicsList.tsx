import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  FolderOpen,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { ProjectWithProposals, TopicsListProps } from "@/types/project";
import { useProjectsByAppraisalCouncilWithPI } from "@/hooks/queries/project";

export const TopicsList: React.FC<TopicsListProps> = ({ selectedCouncil }) => {
  const navigate = useNavigate();

  const {
    data: projects = [],
    isLoading,
    error,
  } = useProjectsByAppraisalCouncilWithPI(selectedCouncil, ["created"]);

  const handleTopicClick = (project: ProjectWithProposals) => {
    navigate(`/council/project-approval/topic/${project.id}`, {
      state: { project, proposals: project.proposals },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-red-100 rounded-full">
            <FolderOpen className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-base font-medium text-red-900">
            Error loading projects
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <FolderOpen className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-900 mb-1">
                No research topics found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search filters to find more topics
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleTopicClick(project)}
              className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Update to use project data instead of topic */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={
                      project.status === "created"
                        ? "bg-amber-50 text-amber-700 border-amber-200 font-medium px-3 py-1 text-xs"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-3 py-1 text-xs"
                    }
                  >
                    {project.status}
                  </Badge>
                  {project.proposals && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium text-green-700">
                        {project.proposals.length} Proposal
                        {project.proposals.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {project["english-title"]}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Type
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        {project.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FolderOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                        Category
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                        Proposals
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        {project.proposals?.length || 0} Submitted
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Related Fields
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project["project-tags"]?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200 text-xs px-2 py-0.5 font-medium"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {(project["project-tags"]?.length || 0) > 4 && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-200 text-xs px-2 py-0.5 font-medium"
                      >
                        +{(project["project-tags"]?.length || 0) - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="flex justify-end mt-3">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-emerald-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
