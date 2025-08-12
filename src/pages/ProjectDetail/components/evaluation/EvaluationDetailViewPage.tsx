import React, { useEffect, useState } from "react";
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
import {
  FileText,
  Users,
  Eye,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Evaluation } from "@/types/evaluation-api";
import { getEvaluationById } from "../../data/mockEvaluationApiData";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const EvaluationDetailViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, evaluationId } = useParams<{
    projectId: string;
    evaluationId: string;
  }>();
  const { user } = useAuth();
  const [evaluation, setEvaluation] = useState<Evaluation | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (evaluationId) {
      // Use the mock API function
      getEvaluationById(evaluationId)
        .then((foundEvaluation) => {
          setEvaluation(foundEvaluation);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching evaluation:", error);
          setLoading(false);
        });
    }
  }, [evaluationId]);

  const handleBackToEvaluations = () => {
    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }
    navigate(`${routePrefix}/project/${projectId}/evaluation/view`);
  };

  const handleStageClick = (stageId: string) => {
    console.log("Stage clicked:", stageId, "Evaluation:", evaluationId, "Project:", projectId, "User role:", user?.role);
    
    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }
    
    // Updated route to match the actual route pattern in config.tsx
    const targetRoute = `${routePrefix}/project/${projectId}/evaluation/stage/${stageId}/view`;
    console.log("Navigating to stage route:", targetRoute);
    navigate(targetRoute);
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_progress":
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "created":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading evaluation details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluation) {
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
                    Evaluation Not Found
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    The evaluation you're looking for doesn't exist
                  </p>
                  <Button
                    onClick={handleBackToEvaluations}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Evaluations
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 space-y-8">
        {/* Back Button - Standalone */}
        <div className="flex items-center">
          <Button
            onClick={handleBackToEvaluations}
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Evaluations
          </Button>
        </div>

        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-white/20">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(evaluation.status)}
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {evaluation.title} - View Only
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {evaluation.code} • Created:{" "}
                    {new Date(evaluation["create-date"]).toLocaleDateString()} •
                    Read-only evaluation
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(evaluation.status)}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Evaluation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Stages
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {evaluation["evaluation-stages"].length}
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
                    Total Rate
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {evaluation["total-rate"] || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Individual Evaluations
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {evaluation["evaluation-stages"].reduce(
                      (total, stage) =>
                        total + (stage["individual-evaluations"]?.length || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-600">
                    Appraisal Council
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {evaluation["appraisal-council-id"] ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Details */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Evaluation Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluation Code</h4>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">{evaluation.code}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Project ID</h4>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">{evaluation["project-id"]}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Created Date</h4>
                <p className="text-gray-900">{new Date(evaluation["create-date"]).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                <div>{getStatusBadge(evaluation.status)}</div>
              </div>
            </div>
            
            {evaluation.comment && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluation Comment</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{evaluation.comment}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evaluation Stages */}
        <div className="space-y-6">
          {evaluation["evaluation-stages"].length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Evaluation Stages ({evaluation["evaluation-stages"].length})
              </h3>
              <div className="grid gap-4">
                {evaluation["evaluation-stages"]
                  .sort((a, b) => a["stage-order"] - b["stage-order"])
                  .map((stage, index) => (
                    <Card
                      key={stage.id}
                      className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
                      onClick={() => handleStageClick(stage.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {stage.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {stage.type} • {stage.phrase} •{" "}
                              {stage["individual-evaluations"]?.length || 0}{" "}
                              individual evaluations
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(stage.status)}
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 border-blue-200"
                          >
                            View Only
                          </Badge>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-emerald-100 rounded-full">
                            <Eye className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      No evaluation stages
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      This evaluation doesn't have any stages yet
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetailViewPage;
