import React from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui";
import { useNavigate, useParams } from "react-router-dom";
import { EvaluationStage } from "@/types/task";
import { FileText, Calendar, Users, ArrowRight } from "lucide-react";

interface EvaluationBoardTabProps {
  evaluationStages: EvaluationStage[];
}

const EvaluationBoardTab: React.FC<EvaluationBoardTabProps> = ({
  evaluationStages,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

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

  const handleViewAllEvaluations = () => {
    navigate(`/project/${projectId}/evaluation`);
  };

  const handleStageClick = (stageId: string) => {
    navigate(`/project/${projectId}/evaluation/stage/${stageId}`);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Evaluation Board
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Overview of evaluation progress across all stages
            </CardDescription>
          </div>
          <Button
            onClick={handleViewAllEvaluations}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            View All Evaluations
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {evaluationStages.length === 0 ? (
          <div className="text-center py-12">
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
                  onClick={handleViewAllEvaluations}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Go to Evaluations
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Stages
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    {evaluationStages.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Completed
                  </p>
                  <p className="text-xl font-bold text-green-900">
                    {
                      evaluationStages.filter(
                        (stage) => stage.status === "completed"
                      ).length
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-600">
                    In Progress
                  </p>
                  <p className="text-xl font-bold text-yellow-900">
                    {
                      evaluationStages.filter(
                        (stage) => stage.status === "in_progress"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Stages */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Recent Evaluation Stages
              </h4>
              <div className="space-y-3">
                {evaluationStages
                  .sort((a, b) => a.stageOrder - b.stageOrder)
                  .slice(0, 3)
                  .map((stage, index) => (
                    <div
                      key={stage.id}
                      className="group cursor-pointer flex items-center justify-between border border-gray-200 rounded-lg bg-white px-4 py-3 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200"
                      onClick={() => handleStageClick(stage.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700">
                            {stage.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {stage.type} •{" "}
                            {stage.individualEvaluations?.length || 0}{" "}
                            evaluations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(stage.status)}
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                      </div>
                    </div>
                  ))}
              </div>

              {evaluationStages.length > 3 && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleViewAllEvaluations}
                    className="w-full border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    View All {evaluationStages.length} Evaluation Stages
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EvaluationBoardTab;
