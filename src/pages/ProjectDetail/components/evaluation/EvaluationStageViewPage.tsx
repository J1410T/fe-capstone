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
  AlertTriangle,
  Bot,
  User,
} from "lucide-react";
import { EvaluationStageApi } from "@/types/evaluation-api";
import { useAuth, UserRole } from "@/contexts/AuthContext";

// Mock evaluation stage data
const mockEvaluationStageData: EvaluationStageApi = {
  id: "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
  name: "Initial Review",
  "stage-order": 1,
  phrase: "Approval",
  type: "project",
  status: "created",
  "evaluation-id": "e7c34a2b-8f5d-4e3f-9a1c-6b7d8e9f0123",
  "milestone-id": null,
  "appraisal-council-id": null,
  transactions: null,
  "individual-evaluations": [
    {
      id: "a011f1ed-4b91-4ce0-872c-53216acbee9b",
      name: "AI Review",
      "total-rate": null,
      comment: `<h3>Evaluation Report - Philosophy in the Age of Artificial Intelligence</h3>

<p>Based on the provided data for the project titled <strong>"Philosophy in the Age of Artificial Intelligence,"</strong> several key aspects can be evaluated and analyzed for clarity, purpose, and potential impact.</p>

<h4>Title and Description</h4>

<p>The title effectively encapsulates the core theme by merging two significant domains: philosophy and artificial intelligence (AI). The description succinctly outlines the study's objectives, emphasizing the exploration of ethical considerations, human identity, and decision-making autonomy within the context of AI. This focus is both timely and relevant, given the rapid advancements in AI technology and its implications for society.</p>`,
      "submitted-at": "2025-08-12T17:35:44.4527859",
      "is-approved": false,
      "reviewer-result": null,
      "is-ai-report": true,
      status: "created",
      "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
      "reviewer-id": null,
      documents: null,
      "projects-similarity-result": null,
    },
    {
      id: "b021f2ed-5c92-5df1-973d-64327bdcff0c",
      name: "Expert Review #1",
      "total-rate": 8.5,
      comment: `<h3>Expert Evaluation Report</h3>

<p>This project presents a <strong>well-structured approach</strong> to examining the philosophical implications of artificial intelligence in contemporary society.</p>

<h4>Strengths:</h4>
<ul>
  <li>Clear research objectives and methodology</li>
  <li>Interdisciplinary approach combining philosophy and technology</li>
  <li>Relevant and timely research topic</li>
  <li>Strong potential for practical applications</li>
</ul>

<h4>Areas for Improvement:</h4>
<ul>
  <li>Could benefit from more specific research questions</li>
  <li>Timeline could be more detailed</li>
  <li>Budget considerations need refinement</li>
</ul>

<p><em>Overall, this is a promising research proposal with significant potential for impact in both academic and practical domains.</em></p>`,
      "submitted-at": "2025-08-12T16:20:30.1234567",
      "is-approved": true,
      "reviewer-result": "approved",
      "is-ai-report": false,
      status: "completed",
      "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
      "reviewer-id": "rev-123-456-789",
      documents: null,
      "projects-similarity-result": null,
    },
    {
      id: "c031f3ed-6d03-6ef2-084e-75438cedd1d",
      name: "Expert Review #2",
      "total-rate": 7.2,
      comment: `<h3>Secondary Expert Evaluation</h3>

<p>The project <strong>"Philosophy in the Age of Artificial Intelligence"</strong> addresses crucial contemporary issues at the intersection of technology and ethics.</p>

<h4>Evaluation Summary:</h4>

<p>The research proposal demonstrates a solid understanding of the philosophical challenges posed by AI development. The methodology appears sound, though some aspects could be strengthened.</p>

<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
  <h4 style="color: #92400e; margin-top: 0;">Recommendations:</h4>
  <ul>
    <li>Include more diverse philosophical perspectives</li>
    <li>Consider international ethical frameworks</li>
    <li>Expand the scope of AI applications examined</li>
  </ul>
</div>

<p>With these modifications, this project could make significant contributions to the field of AI ethics and philosophy.</p>`,
      "submitted-at": "2025-08-12T14:45:15.9876543",
      "is-approved": true,
      "reviewer-result": "approved_with_conditions",
      "is-ai-report": false,
      status: "completed",
      "evaluation-stage-id": "a6802afe-759a-490c-8ab4-5d39dfe75e2e",
      "reviewer-id": "rev-987-654-321",
      documents: null,
      "projects-similarity-result": null,
    },
  ],
};

interface EvaluationStageViewPageProps {
  stage?: EvaluationStageApi;
  evaluationId?: string;
}

const EvaluationStageViewPage: React.FC<EvaluationStageViewPageProps> = ({
  stage: propStage,
  evaluationId: propEvaluationId,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projectId, evaluationId, stageId } = useParams<{
    projectId: string;
    evaluationId: string;
    stageId: string;
  }>();
  const [evaluationStage, setEvaluationStage] = useState<
    EvaluationStageApi | undefined
  >(propStage);
  const [loading, setLoading] = useState(!propStage);

  useEffect(() => {
    console.log("EvaluationStageViewPage received stage prop:", propStage);
    console.log(
      "EvaluationStageViewPage received evaluationId prop:",
      propEvaluationId
    );
    console.log(
      "URL params - projectId:",
      projectId,
      "evaluationId:",
      evaluationId,
      "stageId:",
      stageId
    );

    // If stage prop is provided, use it directly
    if (propStage) {
      console.log("Using provided stage prop:", propStage.name);
      setEvaluationStage(propStage);
      setLoading(false);
      return;
    }

    // Otherwise, fall back to mock data or fetch from API
    if (stageId && (evaluationId || propEvaluationId)) {
      // Get the stage data from the evaluation API
      const evalId = evaluationId || propEvaluationId;
      import("../../data/mockEvaluationApiData").then(
        ({ getEvaluationById }) => {
          getEvaluationById(evalId!)
            .then((evaluation) => {
              if (evaluation) {
                const foundStage = evaluation["evaluation-stages"].find(
                  (s) => s.id === stageId
                );
                if (foundStage) {
                  setEvaluationStage(foundStage);
                } else {
                  // Fallback to mock data if stage not found
                  setEvaluationStage(mockEvaluationStageData);
                }
                setLoading(false);
              } else {
                // Fallback to mock data if evaluation not found
                setEvaluationStage(mockEvaluationStageData);
                setLoading(false);
              }
            })
            .catch(() => {
              // Fallback to mock data on error
              setEvaluationStage(mockEvaluationStageData);
              setLoading(false);
            });
        }
      );
    } else {
      // No evaluation ID available, use mock data
      setEvaluationStage(mockEvaluationStageData);
      setLoading(false);
    }
  }, [stageId, propStage, propEvaluationId, evaluationId, projectId]);

  const handleBackToEvaluation = () => {
    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }

    // Use prop evaluationId first, then URL param, then fallback to evaluation list
    const evalId = propEvaluationId || evaluationId;
    if (evalId) {
      navigate(`${routePrefix}/project/${projectId}/evaluation/${evalId}/view`);
    } else {
      // Navigate to evaluation list page instead
      navigate(`${routePrefix}/project/${projectId}/evaluation/view`);
    }
  };

  const handleViewIndividualEvaluation = (individualId: string) => {
    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }
    // Use the simpler route pattern for individual evaluations
    const targetRoute = `${routePrefix}/project/${projectId}/evaluation/individual/${individualId}`;
    console.log("Navigating to individual evaluation:", targetRoute);
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

  const getApprovalBadge = (
    isApproved: boolean,
    reviewerResult: string | null
  ) => {
    if (isApproved) {
      if (reviewerResult === "approved_with_conditions") {
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Approved with Conditions
          </Badge>
        );
      }
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Not Approved</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading evaluation stage...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluationStage) {
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
                    Evaluation Stage Not Found
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    The evaluation stage you're looking for doesn't exist
                  </p>
                  <Button
                    onClick={handleBackToEvaluation}
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

  const completedEvaluations = (
    evaluationStage["individual-evaluations"] || []
  ).filter((e) => e.status === "completed").length;
  const approvedEvaluations = (
    evaluationStage["individual-evaluations"] || []
  ).filter((e) => e["is-approved"]).length;
  const aiReports = (evaluationStage["individual-evaluations"] || []).filter(
    (e) => e["is-ai-report"]
  ).length;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        {/* Back Button - Standalone */}
        <div className="flex items-center">
          <Button
            onClick={handleBackToEvaluation}
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
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {evaluationStage.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Evaluation Stage • Read-only evaluation stage
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-600 border-blue-200"
                >
                  Stage View
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Evaluations
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {(evaluationStage["individual-evaluations"] || []).length}
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
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {completedEvaluations}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    Approved
                  </p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {approvedEvaluations}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    AI Reports
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {aiReports}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Evaluations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Individual Evaluations
            </CardTitle>
            <CardDescription>
              All evaluations within this stage (Read-only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(evaluationStage["individual-evaluations"] || []).length > 0 ? (
              <div className="space-y-4">
                {(evaluationStage["individual-evaluations"] || []).map(
                  (evaluation) => (
                    <Card
                      key={evaluation.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {evaluation["is-ai-report"] ? (
                              <Bot className="h-8 w-8 text-purple-600" />
                            ) : (
                              <User className="h-8 w-8 text-blue-600" />
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {evaluation.name}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-gray-600">
                                  Submitted:{" "}
                                  {new Date(
                                    evaluation["submitted-at"]
                                  ).toLocaleDateString()}
                                </p>
                                {evaluation["total-rate"] && (
                                  <p className="text-sm text-gray-600">
                                    Rate:{" "}
                                    <span className="font-semibold">
                                      {evaluation["total-rate"]}/10
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(evaluation.status)}
                            {getApprovalBadge(
                              evaluation["is-approved"],
                              evaluation["reviewer-result"] as string | null
                            )}
                            {evaluation["is-ai-report"] && (
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-600 border-purple-200"
                              >
                                AI Report
                              </Badge>
                            )}
                            <Button
                              onClick={() =>
                                handleViewIndividualEvaluation(evaluation.id)
                              }
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                        {evaluation.comment && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {evaluation.comment
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 200)}
                              ...
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      No individual evaluations
                    </p>
                    <p className="text-sm text-gray-500">
                      This stage doesn't have any individual evaluations yet
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stage Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Stage Information
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
                    <span className="text-gray-600">Stage ID:</span>
                    <span className="font-mono text-gray-900">
                      {evaluationStage.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evaluation ID:</span>
                    <span className="font-mono text-gray-900">
                      {evaluationStage["evaluation-id"]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage Name:</span>
                    <span className="text-gray-900">
                      {evaluationStage.name}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Evaluations:</span>
                    <span className="text-gray-900">
                      {(evaluationStage["individual-evaluations"] || []).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="text-gray-900">
                      {completedEvaluations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved:</span>
                    <span className="text-gray-900">{approvedEvaluations}</span>
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

export default EvaluationStageViewPage;
