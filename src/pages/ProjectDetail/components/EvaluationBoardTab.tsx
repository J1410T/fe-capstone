import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  User,
  Bot,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EvaluationStage,
  EvaluationSummary,
  IndividualEvaluation,
} from "@/types/task";

interface EvaluationBoardTabProps {
  evaluationStages: EvaluationStage[];
  evaluationSummary: EvaluationSummary;
}

export const EvaluationBoardTab: React.FC<EvaluationBoardTabProps> = ({
  evaluationStages,
  evaluationSummary,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getEvaluatorIcon = (evaluation: IndividualEvaluation) => {
    return evaluation.isAIReport ? (
      <Bot className="w-4 h-4 text-blue-600" />
    ) : (
      <User className="w-4 h-4 text-gray-600" />
    );
  };

  const handleViewEvaluation = (stageId: string, evaluationId: string) => {
    navigate(
      `/projects/${projectId}/evaluation-board/${stageId}/${evaluationId}`
    );
  };

  const handleCreateEvaluation = (stageId: string) => {
    // Navigate to create evaluation page or open modal
    console.log("Create evaluation for stage:", stageId);
  };

  const handleViewAllEvaluations = () => {
    navigate(`/project/${projectId}/detail/evaluation`);
  };

  const completionPercentage =
    evaluationSummary.totalStages > 0
      ? Math.round(
          (evaluationSummary.completedEvaluations /
            (evaluationSummary.totalStages * 3)) *
            100
        ) // Assuming 3 evaluators per stage
      : 0;

  return (
    <div className="space-y-6">
      {/* Project Evaluation Summary Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Project Evaluation Summary
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Overview of evaluation progress across all stages
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAllEvaluations}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View All Evaluations
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-blue-800">
                    {evaluationSummary.totalStages}
                  </p>
                  <p className="text-xs text-blue-700">Total Stages</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-lg font-semibold text-green-800">
                    {evaluationSummary.completedEvaluations}
                  </p>
                  <p className="text-xs text-green-700">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-lg font-semibold text-yellow-800">
                    {evaluationSummary.pendingEvaluations}
                  </p>
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-lg font-semibold text-purple-800">
                    {evaluationSummary.averageScore?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-xs text-purple-700">Avg Score</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Evaluations Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Individual Evaluations
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Detailed evaluations organized by evaluation stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evaluationStages.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-2">
              {evaluationStages.map((stage) => (
                <AccordionItem
                  key={stage.id}
                  value={stage.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">
                            {stage.title}
                          </h3>
                          {stage.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {stage.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(stage.status)}
                        >
                          {stage.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {stage.individualEvaluations.length} evaluations
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-3">
                      {stage.individualEvaluations.map((evaluation) => (
                        <div
                          key={evaluation.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            {getEvaluatorIcon(evaluation)}
                            <div>
                              <p className="font-medium text-gray-900">
                                {evaluation.evaluator ||
                                  (evaluation.isAIReport
                                    ? "AI Evaluation"
                                    : "Council Member")}
                              </p>
                              <p className="text-sm text-gray-500">
                                Score: {evaluation.totalRate}/10
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(evaluation.status)}
                            >
                              {evaluation.status}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewEvaluation(stage.id, evaluation.id)
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Create New Evaluation Button */}
                      <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => handleCreateEvaluation(stage.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Evaluation
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No Evaluation Stages</p>
              <p className="text-sm">
                Evaluation stages will appear here once they are created for
                this project.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationBoardTab;
