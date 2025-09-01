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
import { ArrowLeft, Edit, FileText } from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { TinyMCEViewer } from "@/components/ui/TinyMCE";
import { AIEvaluationDisplay } from "@/components/ui/ai-evaluation-display";
import { getIndividualEvaluationById } from "@/services/resources/evaluation";
import { IndividualEvaluationApi } from "@/types/evaluation";
import { useGetIndividualEvaluationById } from "@/hooks/queries/evaluation";

const IndividualEvaluationViewPage: React.FC = () => {
  const { evaluationId, stageId, individualId } = useParams<{
    evaluationId: string;
    stageId: string;
    individualId: string;
  }>();
  const navigate = useNavigate();

  // State management
  const [individualEvaluation, setIndividualEvaluation] =
    useState<IndividualEvaluationApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Query hooks
  const { data: individualEvaluationData, isLoading: isLoadingQuery } =
    useGetIndividualEvaluationById(individualId || "");

  // Load individual evaluation details
  useEffect(() => {
    const loadIndividualEvaluation = async () => {
      if (!individualId) return;

      try {
        setIsLoading(true);

        const evaluation = await getIndividualEvaluationById({
          id: individualId,
        });

        setIndividualEvaluation(evaluation);
      } catch (error) {
        console.error("Error loading individual evaluation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIndividualEvaluation();
  }, [individualId]);

  // Handle individual evaluation data from query hooks
  useEffect(() => {
    if (individualEvaluationData) {
      setIndividualEvaluation(individualEvaluationData);
      setIsLoading(false);
    }
  }, [individualEvaluationData]);

  const handleEdit = () => {
    navigate(
      `/council/edit-individual-evaluation/${evaluationId}/${stageId}/${individualId}`
    );
  };

  const handleBackToStage = () => {
    navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`);
  };

  if (isLoading || isLoadingQuery) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (!individualEvaluation) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Cannot find individual evaluation</p>
            <Button
              variant="outline"
              onClick={handleBackToStage}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAIGenerated = individualEvaluation["is-ai-report"] === true;

  const hasDocuments =
    individualEvaluation.documents && individualEvaluation.documents.length > 0;
  const firstDocument = hasDocuments
    ? individualEvaluation.documents?.[0]
    : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBackToStage}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {individualEvaluation.name || "Individual Evaluation"}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Score:</span>
              <span className="text-lg font-bold text-blue-600">
                {individualEvaluation["total-rate"] || 0}/100
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  individualEvaluation.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : individualEvaluation.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {individualEvaluation.status || "Unknown"}
              </span>
            </div>
          </div>
        </div>
        {!isAIGenerated && (
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Evaluation Content */}
      {isAIGenerated ? (
        <AIEvaluationDisplay
          content={individualEvaluation.comment || "No AI analysis available"}
          title={individualEvaluation.name}
          score={individualEvaluation["total-rate"]}
          status={individualEvaluation.status}
          submittedAt={individualEvaluation["submitted-at"]}
          compact={false}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Content</CardTitle>
            <CardDescription>Detailed evaluation content</CardDescription>
          </CardHeader>
          <CardContent>
            {hasDocuments && firstDocument?.["content-html"] ? (
              <div className="prose max-w-none">
                <TinyMCEViewer content={firstDocument["content-html"]} />
              </div>
            ) : individualEvaluation.comment ? (
              <div className="prose max-w-none">
                <TinyMCEViewer content={individualEvaluation.comment} />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No evaluation content</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Evaluation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Details</CardTitle>
          <CardDescription>Summary and additional information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Evaluation Name */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                Evaluation Name:
              </h4>
              <p className="text-sm text-gray-900 font-medium">
                {individualEvaluation.name || "Unnamed Evaluation"}
              </p>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                Total Score:
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {individualEvaluation["total-rate"] || 0}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                Document Type:
              </h4>
              <p className="text-sm text-gray-600 font-mono">
                {hasDocuments ? firstDocument?.type : "N/A"}
              </p>
            </div>

            {/* Reviewer Result */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                Reviewer Result:
              </h4>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  individualEvaluation["reviewer-result"]
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {individualEvaluation["reviewer-result"]
                  ? "Approved"
                  : "Not Approved"}
              </span>
            </div>

            {/* AI Report */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                Report Type:
              </h4>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isAIGenerated
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {isAIGenerated ? "AI Generated" : "Manual Review"}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Reviewer:</h4>
              <div className="flex items-center gap-2">
                {individualEvaluation["reviewer-avatar"] && (
                  <img
                    src={individualEvaluation["reviewer-avatar"]}
                    alt="Reviewer"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    {individualEvaluation["reviewer-name"] || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {individualEvaluation["reviewer-email"]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Short Comment */}
          {individualEvaluation.comment && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">
                  Short Comment:
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {individualEvaluation.comment}
                </p>
              </div>
            </div>
          )}

          {/* Submitted At */}
          {individualEvaluation["submitted-at"] && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">
                  Submitted At:
                </h4>
                <p className="text-sm text-gray-600">
                  {new Date(
                    individualEvaluation["submitted-at"]
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndividualEvaluationViewPage;
