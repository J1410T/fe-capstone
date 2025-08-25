import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Loading,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  FileText,
  User,
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Bot,
  Star,
} from "lucide-react";
import { TinyMCEViewer } from "@/components/ui/TinyMCE";
import AIEvaluationDisplay from "@/components/ui/ai-evaluation-display";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useGetIndividualEvaluationById } from "@/hooks/queries/evaluation";

const IndividualEvaluationDetailViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projectId, evaluationId, stageId, individualEvaluationId } =
    useParams<{
      projectId: string;
      evaluationId: string;
      stageId: string;
      individualEvaluationId: string;
    }>();

  const {
    data: individualEvaluation,
    isLoading: loading,
    isError,
    error,
  } = useGetIndividualEvaluationById(individualEvaluationId || "");

  const handleBackToStage = () => {
    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }

    // Always try to go back to stage view first
    if (stageId) {
      navigate(
        `${routePrefix}/project/${projectId}/evaluation/stage/${stageId}/view`
      );
    } else {
      // If no stageId, we need to find the stage from the individual evaluation
      // Look up the evaluation stage ID from the individual evaluation data
      if (individualEvaluation && individualEvaluation["evaluation-stage-id"]) {
        navigate(
          `${routePrefix}/project/${projectId}/evaluation/stage/${individualEvaluation["evaluation-stage-id"]}/view`
        );
      } else if (evaluationId) {
        // Fallback to evaluation detail view
        navigate(
          `${routePrefix}/project/${projectId}/evaluation/${evaluationId}/view`
        );
      } else {
        // Last resort: evaluation list
        navigate(`${routePrefix}/project/${projectId}/evaluation/view`);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "created":
        return <Badge className="bg-blue-100 text-blue-800">Created</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loading />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !individualEvaluation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <Card className="text-center py-16">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    Individual Evaluation Not Found
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {isError && error
                      ? `Error: ${error.message}`
                      : "The individual evaluation you're looking for doesn't exist"}
                  </p>
                  <Button
                    onClick={handleBackToStage}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Stage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        {/* Back Button - Standalone */}
        <div className="flex items-center">
          <Button
            onClick={handleBackToStage}
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Stage
          </Button>
        </div>

        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-white/20">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {individualEvaluation["is-ai-report"] ? (
                  <Bot className="h-8 w-8 text-blue-600" />
                ) : (
                  <User className="h-8 w-8 text-emerald-600" />
                )}
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {individualEvaluation.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {individualEvaluation["is-ai-report"]
                      ? "AI Generated"
                      : "Human"}{" "}
                    Review • Submitted:{" "}
                    {new Date(
                      individualEvaluation["submitted-at"]
                    ).toLocaleDateString()}{" "}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(individualEvaluation.status)}
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-600 border-purple-200"
                >
                  {individualEvaluation["is-ai-report"]
                    ? "AI Report"
                    : "Human Review"}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Evaluation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Rate
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {individualEvaluation["total-rate"] || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Approval Status
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {individualEvaluation["is-approved"]
                      ? "Approved"
                      : "Pending"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {individualEvaluation["is-ai-report"] ? (
                  <Bot className="h-6 w-6 text-purple-600" />
                ) : (
                  <User className="h-6 w-6 text-purple-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Review Type
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {individualEvaluation["is-ai-report"] ? "AI" : "Human"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Evaluation Content
            </CardTitle>
            <CardDescription>
              Detailed evaluation comments and feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {individualEvaluation["is-ai-report"] ? (
              individualEvaluation.comment ? (
                <AIEvaluationDisplay
                  content={individualEvaluation.comment}
                  title={individualEvaluation.name}
                  score={individualEvaluation["total-rate"]}
                  status={individualEvaluation.status}
                  submittedAt={individualEvaluation["submitted-at"]}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No AI evaluation content
                      </p>
                      <p className="text-sm text-gray-500">
                        This AI evaluation doesn't have any content yet
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : individualEvaluation.comment ? (
              <TinyMCEViewer
                content={individualEvaluation.comment}
                height={600}
              />
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      No evaluation content
                    </p>
                    <p className="text-sm text-gray-500">
                      This evaluation doesn't have any content yet
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Evaluation Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Basic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evaluation ID:</span>
                    <span className="font-mono text-gray-900">
                      {individualEvaluation.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage ID:</span>
                    <span className="font-mono text-gray-900">
                      {individualEvaluation["evaluation-stage-id"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviewer ID:</span>
                    <span className="font-mono text-gray-900">
                      {individualEvaluation["reviewer-id"] || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Status Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(individualEvaluation.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="text-gray-900">
                      {new Date(
                        individualEvaluation["submitted-at"]
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Is AI Report:</span>
                    <span className="text-gray-900">
                      {individualEvaluation["is-ai-report"] ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndividualEvaluationDetailViewPage;
