import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, User, Bot, Calendar, FileText } from "lucide-react";
import { EvaluationStage, IndividualEvaluation } from "@/types/task";
import { getEvaluationById } from "../data/mockEvaluationApiData";
import { useAuth } from "@/contexts/AuthContext";
import { canCreateIndividualEvaluation } from "@/utils/evaluationPermissions";

const StageViewPage: React.FC = () => {
  const { evaluationId, stageId } = useParams<{
    evaluationId: string;
    stageId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState<EvaluationStage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check user permissions
  const hasCreatePermission = canCreateIndividualEvaluation(user);

  useEffect(() => {
    if (evaluationId && stageId) {
      setIsLoading(true);
      getEvaluationById(evaluationId)
        .then((evaluation) => {
          if (evaluation) {
            const foundStage = evaluation["evaluation-stages"].find(
              (s) => s.id === stageId
            );
            if (foundStage) {
              // Convert API stage to local stage format
              const convertedStage: EvaluationStage = {
                id: foundStage.id,
                name: foundStage.name,
                type: foundStage.type,
                phrase: foundStage.phrase,
                stageOrder: foundStage["stage-order"],
                title: foundStage.name,
                description: foundStage.type + " - " + foundStage.phrase,
                status: foundStage.status,
                order: foundStage["stage-order"],
                createdAt: "", // API doesn't provide this field
                evaluationId: foundStage["evaluation-id"],
                individualEvaluations: (
                  foundStage["individual-evaluations"] || []
                ).map((ie) => ({
                  id: ie.id,
                  evaluator: ie.name || "Unknown",
                  status: ie.status,
                  totalRate: ie["total-rate"] || 0,
                  submittedAt: ie["submitted-at"] || "",
                  documentId: ie.documents ? "attached" : "",
                  isAIReport: ie["is-ai-report"] || false,
                  comment: ie.comment || "",
                  isApproved: ie["is-approved"],
                  reviewerResult: Boolean(ie["reviewer-result"]),
                  evaluationStageId: ie["evaluation-stage-id"],
                  reviewerId: ie["reviewer-id"] || "",
                  projectId: evaluation["project-id"],
                  milestoneId: foundStage["milestone-id"] || "",
                })),
              };
              setStage(convertedStage);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching evaluation stage:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [evaluationId, stageId]);

  const handleBack = () => {
    // Navigate back to evaluation list
    navigate(-1);
  };

  const handleCreateIndividualEvaluation = () => {
    // Navigate to create individual evaluation page or open modal
    console.log("Create new individual evaluation for stage:", stageId);
  };

  const handleViewIndividualEvaluation = (individualId: string) => {
    navigate(
      `/evaluation/${evaluationId}/stage/${stageId}/individual/${individualId}`
    );
  };

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
      <Bot className="w-5 h-5 text-blue-600" />
    ) : (
      <User className="w-5 h-5 text-gray-600" />
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not submitted";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stage details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="container mx-auto py-6">
        <Card className="shadow-sm">
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Stage Not Found</p>
              <p className="text-sm">
                The requested evaluation stage could not be found.
              </p>
              <Button onClick={handleBack} className="mt-4">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{stage.title}</h1>
            <p className="text-gray-600">
              {stage.description || "Evaluation stage details"}
            </p>
          </div>
        </div>
        {hasCreatePermission && (
          <Button
            onClick={handleCreateIndividualEvaluation}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Individual Evaluation
          </Button>
        )}
      </div>

      {/* Stage Info */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Stage Information
            </CardTitle>
            <Badge variant="outline" className={getStatusColor(stage.status)}>
              {stage.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700">Created Date</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-gray-900">
                  {stage.createdAt ? formatDate(stage.createdAt) : "N/A"}
                </p>
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-700">Order</label>
              <p className="text-gray-900 mt-1">Stage {stage.order}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">
                Individual Evaluations
              </label>
              <p className="text-gray-900 mt-1">
                {stage.individualEvaluations.length} evaluations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Evaluations */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Individual Evaluations
          </CardTitle>
          <CardDescription>
            List of individual evaluations within this stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stage.individualEvaluations.length > 0 ? (
            <div className="space-y-4">
              {stage.individualEvaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getEvaluatorIcon(evaluation)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {evaluation.evaluator ||
                            (evaluation.isAIReport
                              ? "AI Evaluation"
                              : "Council Member")}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(evaluation.status)}
                        >
                          {evaluation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Score:{" "}
                          {evaluation.totalRate > 0
                            ? `${evaluation.totalRate}/10`
                            : "Not scored"}
                        </span>
                        <span>
                          Submitted: {formatDate(evaluation.submittedAt)}
                        </span>
                        {evaluation.documentId && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>Document attached</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewIndividualEvaluation(evaluation.id)
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                No Individual Evaluations
              </p>
              <p className="text-sm mb-4">
                No individual evaluations have been created for this stage yet.
              </p>
              {hasCreatePermission && (
                <Button
                  onClick={handleCreateIndividualEvaluation}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create First Individual Evaluation
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Notice */}
      {!hasCreatePermission && (
        <Card className="shadow-sm border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-blue-800">
              <FileText className="w-5 h-5" />
              <div>
                <p className="font-medium">View Only Access</p>
                <p className="text-sm text-blue-700">
                  Only council members can create individual evaluations. You
                  can view existing evaluations and their details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StageViewPage;
