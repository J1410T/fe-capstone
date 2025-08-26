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
import {
  ArrowLeft,
  Calendar,
  FileText,
  Star,
  Eye,
  Plus,
  Users,
  Edit,
  User,
  Briefcase,
  Tag,
  Clock,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { AIEvaluationDisplay } from "@/components/ui/ai-evaluation-display";
import {
  getIndividualEvaluationsByStageId,
  getEvaluationStageById,
  getAllEvaluationStages,
  getEvaluationById,
} from "@/services/resources/evaluation";
import { useAuth } from "@/contexts";
import { useGetIndividualEvaluationsByStageId } from "@/hooks/queries/evaluation";
import { useProject } from "@/hooks/queries/project";
import {
  EvaluationStageApi,
  IndividualEvaluationApi,
} from "@/types/evaluation";
import { useGetUserRoleById } from "@/hooks/queries/useAuth";

// Component to display reviewer name from reviewer ID
const ReviewerName: React.FC<{ reviewerId: string | null }> = ({
  reviewerId,
}) => {
  const { data: userRole, isLoading } = useGetUserRoleById(reviewerId || "");

  if (!reviewerId) {
    return <span className="text-sm text-gray-600">Reviewer: N/A</span>;
  }

  if (isLoading) {
    return <span className="text-sm text-gray-600">Reviewer: Loading...</span>;
  }

  return (
    <span className="text-sm text-gray-600">
      Reviewer: {userRole?.["full-name"] || "Unknown"}
    </span>
  );
};

const EvaluationStageDetailPage: React.FC = () => {
  const { evaluationId, stageId } = useParams<{
    evaluationId: string;
    stageId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [stage, setStage] = useState<EvaluationStageApi | null>(null);
  const [individualEvaluations, setIndividualEvaluations] = useState<
    IndividualEvaluationApi[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadTimestamp, setLoadTimestamp] = useState<number>(Date.now());
  const [projectData, setProjectData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Query hooks
  const { data: individualEvaluationsData } =
    useGetIndividualEvaluationsByStageId(stageId || "");
  const { data: projectQueryData } = useProject(projectId || "");

  // Load stage details and individual evaluations
  useEffect(() => {
    const loadStageDetails = async () => {
      if (!stageId) return;

      try {
        setIsLoading(true);

        // Clear previous state to prevent stale data
        setStage(null);
        setIndividualEvaluations([]);
        setLoadTimestamp(Date.now());

        try {
          // Method 1: Try direct API call first
          const stageData = await getEvaluationStageById(stageId, true);
          setStage(stageData);
          setIndividualEvaluations(stageData["individual-evaluations"] || []);

          // Load project data if evaluation-id is available
          if (evaluationId) {
            try {
              const evaluationData = await getEvaluationById(
                evaluationId,
                false
              );
              if (evaluationData["project-id"]) {
                const projectDataKey = `project_${evaluationData["project-id"]}`;
                const storedProjectData =
                  localStorage.getItem(projectDataKey) ||
                  sessionStorage.getItem(projectDataKey);

                if (storedProjectData) {
                  try {
                    const parsedProjectData = JSON.parse(storedProjectData);
                    console.log(
                      "✅ Found project data for stage:",
                      parsedProjectData
                    );
                    setProjectData(parsedProjectData);
                  } catch (parseError) {
                    console.error("Error parsing project data:", parseError);
                  }
                }

                // Set project ID for query hook
                if (evaluationData["project-id"]) {
                  setProjectId(evaluationData["project-id"]);
                }
              }
            } catch (evalError) {
              console.error(
                "Error loading evaluation for project data:",
                evalError
              );
            }
          }
        } catch {
          // Method 2: Use list API and filter
          try {
            const allStagesResponse = await getAllEvaluationStages({
              "page-index": 1,
              "page-size": 50,
            });

            const allStages = allStagesResponse["data-list"] || [];
            const targetStage = allStages.find(
              (stage: any) => stage.id === stageId
            );

            if (targetStage) {
              setStage(targetStage);
              setIndividualEvaluations(
                targetStage["individual-evaluations"] || []
              );
            } else {
              throw new Error("Stage not found");
            }
          } catch {
            // Method 3: Fallback with individual evaluations only
            const individualsResponse = await getIndividualEvaluationsByStageId(
              {
                "evaluation-stage-id": stageId,
                "page-index": 1,
                "page-size": 20,
              }
            );

            setIndividualEvaluations(individualsResponse["data-list"] || []);

            // Create fallback stage data
            setStage({
              id: stageId,
              name: "Stage Details",
              "stage-order": 1,
              phrase: "Approval",
              type: "project",
              status: "created",
              "evaluation-id": evaluationId || "",
              "milestone-id": null,
              "appraisal-council-id": null,
              transactions: null,
              "individual-evaluations": individualsResponse["data-list"] || [],
            });
          }
        }
      } catch {
        setStage(null);
        setIndividualEvaluations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStageDetails();
  }, [stageId, evaluationId]);

  // Handle individual evaluations data from query hooks
  useEffect(() => {
    if (individualEvaluationsData?.["data-list"]) {
      setIndividualEvaluations(individualEvaluationsData["data-list"]);
    }
  }, [individualEvaluationsData]);

  // Handle project data from query hooks
  useEffect(() => {
    if (projectQueryData?.data?.["project-detail"]) {
      setProjectData(projectQueryData.data["project-detail"]);
    }
  }, [projectQueryData]);

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

  const handleIndividualEvaluationClick = (individualId: string) => {
    navigate(
      `/council/individual-evaluation/${evaluationId}/${stageId}/${individualId}`
    );
  };

  const handleCreateIndividualEvaluation = () => {
    navigate(
      `/council/create-individual-evaluation/${evaluationId}/${stageId}`
    );
  };

  const handleEditIndividualEvaluation = (individualId: string) => {
    navigate(
      `/council/edit-individual-evaluation/${evaluationId}/${stageId}/${individualId}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Evaluation stage not found</p>
            <Button
              variant="outline"
              onClick={() =>
                navigate(`/council/evaluation-detail/${evaluationId}`)
              }
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Evaluation Detail
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Separate individual evaluations by type
  const userEvaluations = individualEvaluations.filter(
    (evaluation) => (evaluation as any)["is-ai-report"] !== true
  );
  const aiEvaluations = individualEvaluations.filter(
    (evaluation) => (evaluation as any)["is-ai-report"] === true
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/council/evaluation-detail/${evaluationId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Evaluation
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evaluation Stage</h1>
          <p className="text-gray-600 mt-1">
            Project information, stage details and individual evaluations
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

      {/* Stage Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  Stage {stage["stage-order"]}
                </span>
                {stage.name}
              </CardTitle>
              <CardDescription className="mt-2">
                Phrase: {stage.phrase} • Type: {stage.type}
              </CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(stage.status)}>
              {stage.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              Individual Evaluations: {individualEvaluations.length}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              User Evaluations: {userEvaluations.length}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              AI Evaluations: {aiEvaluations.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Evaluations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Individual Evaluations</CardTitle>
              <CardDescription>
                Individual evaluations in this stage
              </CardDescription>
            </div>
            <Button onClick={handleCreateIndividualEvaluation}>
              <Plus className="h-4 w-4 mr-2" />
              Create Individual Evaluation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {individualEvaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No individual evaluations yet</p>
              <Button
                variant="outline"
                onClick={handleCreateIndividualEvaluation}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Individual Evaluation
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Evaluations */}
              {userEvaluations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Individual Evaluations ({userEvaluations.length})
                  </h3>
                  <div className="grid gap-4">
                    {userEvaluations.map((evaluation) => (
                      <Card
                        key={evaluation.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() =>
                          handleIndividualEvaluationClick(evaluation.id)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  {evaluation.name}
                                </h4>
                                <Badge
                                  variant={getStatusBadgeVariant(
                                    evaluation.status
                                  )}
                                >
                                  {evaluation.status}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(
                                    (evaluation as any)["created-date"] ||
                                      (evaluation as any)["create-date"] ||
                                      Date.now()
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                                {(evaluation as any).rate && (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    {(evaluation as any).rate}/100
                                  </span>
                                )}
                                <ReviewerName
                                  reviewerId={evaluation["reviewer-id"]}
                                />
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {/* Only show Edit button if this evaluation belongs to current user */}
                              {user &&
                                (evaluation as any)["reviewer-id"] ===
                                  user.id && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditIndividualEvaluation(
                                        evaluation.id
                                      );
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIndividualEvaluationClick(
                                    evaluation.id
                                  );
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Evaluations */}
              {aiEvaluations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    AI Evaluations ({aiEvaluations.length})
                  </h3>
                  <div className="grid gap-4">
                    {aiEvaluations.map((evaluation) => (
                      <div
                        key={`${stageId}-${evaluation.id}-${loadTimestamp}-${
                          evaluation.comment?.length || 0
                        }`}
                        className="cursor-pointer"
                        onClick={() =>
                          handleIndividualEvaluationClick(evaluation.id)
                        }
                      >
                        <AIEvaluationDisplay
                          content={
                            evaluation.comment || "No AI analysis available"
                          }
                          title={evaluation.name}
                          score={(evaluation as any)["total-rate"]}
                          status={evaluation.status}
                          submittedAt={(evaluation as any)["submitted-at"]}
                          compact={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationStageDetailPage;
