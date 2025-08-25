import React, { useState, useEffect, useCallback } from "react";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Star,
  Eye,
  Plus,
  Users,
  Briefcase,
  Tag,
  Clock,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import {
  getEvaluationStagesByEvaluationId,
  getEvaluationById,
} from "@/services/resources/evaluation";
import { checkIsChaimainInCouncil } from "@/services/resources/auth";
import { getAppraisalCouncilByProjectId } from "@/services/resources/appraisal-council";
import { useAuth } from "@/contexts";
import { useProject } from "@/hooks/queries/project";
import { useGetEvaluationsByProjectId } from "@/hooks/queries/evaluation";
import { Evaluation, EvaluationStageApi } from "@/types/evaluation";
import CreateEvaluationStageModal from "./CreateEvaluationStageModal";

const EvaluationDetailPage: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [stages, setStages] = useState<EvaluationStageApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChairman, setIsChairman] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Query hooks
  const { data: projectQueryData } = useProject(projectId || "");
  const { data: evaluationsData } = useGetEvaluationsByProjectId(
    projectId || ""
  );

  // Simple Chairman Role Check Function (from TopicDetailPage)
  const checkChairmanRole = useCallback(async (projectId: string | null) => {
    try {
      if (!projectId) {
        console.log("No project ID available");
        setIsChairman(false);
        return;
      }

      // Get appraisal council by project ID
      const appraisalCouncilProjectMain = await getAppraisalCouncilByProjectId(
        projectId
      );

      // Check if current user is chairman in this council
      const responseAppraisalCouncilProjectMain =
        await checkIsChaimainInCouncil(appraisalCouncilProjectMain.id);

      if (responseAppraisalCouncilProjectMain["total-count"] === 1) {
        setIsChairman(true);
      } else {
        setIsChairman(false);
      }
    } catch (error) {
      console.error("Chairman role check error:", error);
      setIsChairman(false);
    }
  }, []);

  // Load evaluation details and stages
  useEffect(() => {
    const loadEvaluationDetails = async () => {
      if (!evaluationId) return;

      try {
        setIsLoading(true);

        // Load evaluation with stages using the new API
        try {
          const evaluationData = await getEvaluationById(evaluationId, true);
          console.log("=== DEBUG: Evaluation Data ===");
          console.log("Full evaluation data:", evaluationData);
          console.log("Project ID:", evaluationData["project-id"]);

          setEvaluation(evaluationData);
          setStages(evaluationData["evaluation-stages"] || []);

          // Set project ID to trigger query hooks
          if (evaluationData["project-id"]) {
            setProjectId(evaluationData["project-id"]);
          }

          // Simple Chairman Role Check using project ID
          await checkChairmanRole(evaluationData["project-id"]);
        } catch {
          // Fallback: Load stages separately and create mock evaluation
          const stagesResponse = await getEvaluationStagesByEvaluationId({
            "evaluation-id": evaluationId,
            "page-index": 1,
            "page-size": 20,
          });

          setStages(stagesResponse["data-list"] || []);

          // Mock evaluation data for fallback
          setEvaluation({
            id: evaluationId,
            code: "EVA-SAMPLE",
            title: "Sample Evaluation",
            "total-rate": null,
            comment: null,
            "create-date": new Date().toISOString(),
            status: "created",
            "project-id": "",
            "appraisal-council-id": null,
            documents: null,
            "evaluation-stages": stagesResponse["data-list"] || [],
          });

          // Still try to check chairman role with fallback
          await checkChairmanRole(null);
        }
      } catch {
        setEvaluation(null);
        setStages([]);
        setIsChairman(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluationDetails();
  }, [evaluationId, user?.id, user, checkChairmanRole]);

  // Handle project data from query hooks
  useEffect(() => {
    if (projectQueryData?.data?.["project-detail"]) {
      setProjectData(projectQueryData.data["project-detail"]);
    }
  }, [projectQueryData]);

  // Handle evaluations data from query hooks
  useEffect(() => {
    if (
      evaluationsData?.["data-list"] &&
      evaluationsData["data-list"].length > 0
    ) {
      // Update evaluation if needed
      const currentEvaluation = evaluationsData["data-list"].find(
        (evaluation: any) => evaluation.id === evaluationId
      );
      if (currentEvaluation && !evaluation) {
        setEvaluation(currentEvaluation);
      }
    }
  }, [evaluationsData, evaluationId, evaluation]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return "secondary";
      case "submitted":
        return "default";
      case "approved":
        return "default";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleStageClick = (stageId: string) => {
    navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`);
  };

  const handleCreateStage = () => {
    setIsCreateStageModalOpen(true);
  };

  const handleStageCreated = () => {
    // Reload evaluation data to get updated stages
    if (evaluationId) {
      // Re-run the useEffect logic
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Không tìm thấy đánh giá</p>
            <Button
              variant="outline"
              onClick={() => navigate("/council/my-council")}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại My Council
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/council/my-council")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Council
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Evaluation Details
          </h1>
          <p className="text-gray-600 mt-1">
            Project information, evaluation details and stages
          </p>
        </div>
      </div>

      {/* Project Information */}
      {projectData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Project: {projectData.code}
                </CardTitle>
                <CardDescription className="mt-2 max-w-4xl">
                  <div className="space-y-1">
                    <p className="font-medium text-blue-600">
                      {projectData["english-title"]}
                    </p>
                    {projectData["vietnamese-title"] && (
                      <p className="text-gray-600">
                        {projectData["vietnamese-title"]}
                      </p>
                    )}
                  </div>
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {projectData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="font-medium">Created</p>
                  <p>
                    {new Date(projectData["created-at"]).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                <div>
                  <p className="font-medium">Category</p>
                  <p>
                    {projectData.category === "application/implementation"
                      ? "Application"
                      : projectData.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <div>
                  <p className="font-medium">Type</p>
                  <p>{projectData.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p>{projectData.duration} months</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {evaluation.code}
              </CardTitle>
              <CardDescription className="mt-2">
                {evaluation.title}
              </CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(evaluation.status)}>
              {evaluation.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Created:{" "}
              {new Date(evaluation["create-date"]).toLocaleDateString("vi-VN")}
            </div>

            {evaluation["total-rate"] && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4" />
                Rating: {evaluation["total-rate"]}/100
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              Stages: {stages.length}
            </div>
          </div>

          {evaluation.comment && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Comments:
              </h4>
              <p className="text-sm text-gray-600">{evaluation.comment}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Stages */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Evaluation Stages</CardTitle>
              <CardDescription>
                Evaluation stages and individual evaluations
              </CardDescription>
            </div>
            {isChairman && (
              <Button onClick={handleCreateStage}>
                <Plus className="h-4 w-4 mr-2" />
                Create Stage
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No evaluation stages yet</p>
              {isChairman && (
                <Button
                  variant="outline"
                  onClick={handleCreateStage}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Stage
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {stages
                .sort((a, b) => a["stage-order"] - b["stage-order"])
                .map((stage) => (
                  <Card
                    key={stage.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleStageClick(stage.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                              Stage {stage["stage-order"]}
                            </span>
                            <h3 className="font-semibold">{stage.name}</h3>
                            <Badge
                              variant={getStatusBadgeVariant(stage.status)}
                            >
                              {stage.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Phase: {stage.phrase}</span>
                            <span>Type: {stage.type}</span>
                            {stage["individual-evaluations"] && (
                              <span>
                                Individual Evaluations:{" "}
                                {stage["individual-evaluations"].length}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStageClick(stage.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Stage Modal */}
      <CreateEvaluationStageModal
        open={isCreateStageModalOpen}
        onOpenChange={setIsCreateStageModalOpen}
        evaluationId={evaluationId || ""}
        existingStages={stages}
        onStageCreated={handleStageCreated}
        loading={isLoading}
      />
    </div>
  );
};

export default EvaluationDetailPage;
