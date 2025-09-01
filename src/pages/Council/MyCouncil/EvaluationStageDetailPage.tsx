import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import {
  getIndividualEvaluationsByStageId,
  getEvaluationStageById,
  getAllEvaluationStages,
  getEvaluationById,
} from "@/services/resources/evaluation";
import { useAuth } from "@/contexts";
import { useGetIndividualEvaluationsByStageId } from "@/hooks/queries/evaluation";
import {
  EvaluationStageApi,
  IndividualEvaluationApi,
} from "@/types/evaluation";
import { useGetUserRoleById } from "@/hooks/queries/useAuth";
import { checkIsChaimainInCouncil } from "@/services/resources/auth";
import { getAppraisalCouncilByProjectId } from "@/services/resources/appraisal-council";
import UpdateEvaluationStageModal from "./UpdateEvaluationStageModal";

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

  const [projectId, setProjectId] = useState<string | null>(null);
  const [isChairman, setIsChairman] = useState(false);
  const [isUpdateStageModalOpen, setIsUpdateStageModalOpen] = useState(false);

  // Query hooks
  const { data: individualEvaluationsData } =
    useGetIndividualEvaluationsByStageId(stageId || "");

  // Chairman Role Check Function (from TopicDetailPage)
  const checkChairmanRole = React.useCallback(
    async (projectId: string | null) => {
      try {
        if (!projectId) {
          console.log("No project ID available");
          setIsChairman(false);
          return;
        }

        // Get appraisal council by project ID
        const appraisalCouncilProjectMain =
          await getAppraisalCouncilByProjectId(projectId);

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
    },
    []
  );

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
                  } catch (parseError) {
                    console.error("Error parsing project data:", parseError);
                  }
                }

                // Set project ID for query hook
                if (evaluationData["project-id"]) {
                  setProjectId(evaluationData["project-id"]);
                  // Check chairman role
                  await checkChairmanRole(evaluationData["project-id"]);
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
  }, [stageId, evaluationId, checkChairmanRole]);

  // Handle individual evaluations data from query hooks
  useEffect(() => {
    if (individualEvaluationsData?.["data-list"]) {
      setIndividualEvaluations(individualEvaluationsData["data-list"]);
    }
  }, [individualEvaluationsData]);

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

  const handleUpdateStage = () => {
    setIsUpdateStageModalOpen(true);
  };

  const handleStageUpdated = () => {
    // Reload stage data to get updated information
    if (stageId) {
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
          onClick={() => navigate(`/council/project/${projectId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">
            {stage.name}
          </h1>
          <p className="text-gray-600 mt-1 font-open-sans">
            Phrase: {stage.phrase} • Type: {stage.type}
          </p>
        </div>
      </div>

      {/* Stage Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-montserrat">
                Stage Information
              </h2>
              <p className="text-slate-600 mt-2 font-open-sans">
                Overview of this evaluation stage
              </p>
            </div>
            {/* Show Update Stage button if user is chairman and stage status is created */}
            {isChairman && stage.status === "created" && (
              <Button
                onClick={handleUpdateStage}
                className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Stage
              </Button>
            )}
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Total Evaluations
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {individualEvaluations.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  User Evaluations
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {userEvaluations.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  AI Evaluations
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {aiEvaluations.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Evaluations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-montserrat">
                Individual Evaluations
              </h2>
              <p className="text-slate-600 mt-2 font-open-sans">
                Individual evaluations in this stage
              </p>
            </div>
            {stage.status == "created" && (
              <Button
                onClick={handleCreateIndividualEvaluation}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Individual Evaluation
              </Button>
            )}
          </div>
        </div>
        <div className="p-8">
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
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-slate-900 font-montserrat">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    Individual Evaluations ({userEvaluations.length})
                  </h3>
                  <div className="space-y-4">
                    {userEvaluations.map((evaluation) => (
                      <div
                        key={evaluation.id}
                        className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-green-50 hover:from-green-50 hover:to-emerald-100 transition-all duration-300 cursor-pointer border border-slate-200/50 hover:border-green-200"
                        onClick={() =>
                          handleIndividualEvaluationClick(evaluation.id)
                        }
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 font-montserrat group-hover:text-green-700 transition-colors">
                              {evaluation.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600 font-open-sans mt-1">
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
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={getStatusBadgeVariant(evaluation.status)}
                            className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
                          >
                            {evaluation.status}
                          </Badge>
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
                                  className="hover:bg-green-50 hover:border-green-200"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIndividualEvaluationClick(evaluation.id);
                              }}
                              className="hover:bg-green-50 hover:border-green-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Evaluations */}
              {aiEvaluations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-slate-900 font-montserrat">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    AI Evaluations ({aiEvaluations.length})
                  </h3>
                  <div className="space-y-4">
                    {aiEvaluations.map((evaluation) => (
                      <div
                        key={`${stageId}-${evaluation.id}-${loadTimestamp}-${
                          evaluation.comment?.length || 0
                        }`}
                        className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-100 transition-all duration-300 cursor-pointer border border-slate-200/50 hover:border-blue-200"
                        onClick={() =>
                          handleIndividualEvaluationClick(evaluation.id)
                        }
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 font-montserrat group-hover:text-blue-700 transition-colors">
                              {evaluation.name}
                            </h4>
                            <p className="text-sm text-slate-600 font-open-sans mt-1">
                              AI-powered evaluation analysis
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={getStatusBadgeVariant(evaluation.status)}
                            className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
                          >
                            {evaluation.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIndividualEvaluationClick(evaluation.id);
                            }}
                            className="hover:bg-blue-50 hover:border-blue-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Update Stage Modal */}
      <UpdateEvaluationStageModal
        isOpen={isUpdateStageModalOpen}
        onClose={() => setIsUpdateStageModalOpen(false)}
        stage={stage}
        onStageUpdated={handleStageUpdated}
      />
    </div>
  );
};

export default EvaluationStageDetailPage;
