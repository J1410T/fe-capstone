import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Users, Plus } from "lucide-react";
import { EvaluationStage } from "@/types/task";

interface EvaluationListPageProps {
  evaluationStages?: EvaluationStage[];
}

const EvaluationListPage: React.FC<EvaluationListPageProps> = ({
  evaluationStages = [],
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const handleStageClick = (stageId: string) => {
    navigate(`/project/${projectId}/evaluation/stage/${stageId}`);
  };

  const handleCreateEvaluation = () => {
    navigate(`/project/${projectId}/evaluation/create`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-white/20">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Project Evaluations
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Manage and track evaluation stages for this project
                </CardDescription>
              </div>
              <Button
                onClick={handleCreateEvaluation}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Evaluation
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Evaluation Stages List */}
        <div className="space-y-6">
          {evaluationStages.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      No evaluations found
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Start by creating your first evaluation stage
                    </p>
                    <Button
                      onClick={handleCreateEvaluation}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Evaluation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {evaluationStages
                .sort((a, b) => a.stageOrder - b.stageOrder)
                .map((stage, index) => (
                  <Card
                    key={stage.id}
                    className="group cursor-pointer bg-white rounded-2xl border border-gray-200 p-6 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
                    onClick={() => handleStageClick(stage.id)}
                  >
                    {/* Stage Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {stage.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {stage.type} • {stage.phrase}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(stage.status)}
                    </div>

                    {/* Stage Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                            Individual Evaluations
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {stage.individualEvaluations?.length || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 rounded-xl">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                            Evaluators
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {stage.individualEvaluations?.filter(
                              (e) => e.reviewerId
                            ).length || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-50 rounded-xl">
                          <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                            Type
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {stage.type}
                          </p>
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
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationListPage;
