import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, FolderOpen } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  applicants: number;
  status: string;
  councilApprovals?: number;
  totalCouncilMembers?: number;
}

interface TopicsListProps {
  topics: Topic[];
}

export const TopicsList: React.FC<TopicsListProps> = ({ topics }) => {
  const navigate = useNavigate();

  const handleTopicClick = (topicId: number) => {
    navigate(`/council/project-approval/topic/${topicId}`);
  };

  return (
    <div className="space-y-6">
      {topics.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <FolderOpen className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                No research topics found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search filters to find more topics
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className="group cursor-pointer bg-white rounded-2xl border border-gray-200 p-8 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Status and Progress */}
              <div className="flex items-center justify-between mb-6">
                <Badge
                  variant="outline"
                  className={
                    topic.status === "Waiting for PI"
                      ? "bg-amber-50 text-amber-700 border-amber-200 font-medium px-4 py-2"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-4 py-2"
                  }
                >
                  {topic.status}
                </Badge>
              </div>

              {/* Topic Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {topic.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Field
                      </span>
                      <p className="text-lg font-semibold text-gray-900">
                        {topic.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <FolderOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                        Category
                      </span>
                      <p className="text-lg font-semibold text-gray-900">
                        {topic.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                        Proposals
                      </span>
                      <p className="text-lg font-semibold text-gray-900">
                        {topic.applicants} Submitted
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="flex justify-end mt-6">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-emerald-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-emerald-600"
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
