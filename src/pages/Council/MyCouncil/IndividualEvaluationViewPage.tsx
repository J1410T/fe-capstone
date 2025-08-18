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

  const handleEdit = () => {
    navigate(
      `/council/edit-individual-evaluation/${evaluationId}/${stageId}/${individualId}`
    );
  };

  const handleBackToStage = () => {
    navigate(`/council/evaluation-stages/${evaluationId}/${stageId}`);
  };

  if (isLoading) {
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
              Back to Stage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAIGenerated = (individualEvaluation as any)["is-ai-report"] === true;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBackToStage}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stage
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {individualEvaluation.name || "Individual Evaluation"}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Score:</span>
              <span className="text-lg font-bold text-blue-600">
                {(individualEvaluation as any)["total-rate"] || 0}/100
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
          score={(individualEvaluation as any)["total-rate"]}
          status={individualEvaluation.status}
          submittedAt={(individualEvaluation as any)["submitted-at"]}
          compact={false}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Content</CardTitle>
            <CardDescription>Detailed evaluation content</CardDescription>
          </CardHeader>
          <CardContent>
            {(individualEvaluation as any).content ? (
              <div className="prose max-w-none">
                <TinyMCEViewer
                  content={(individualEvaluation as any).content}
                />
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
                  {(individualEvaluation as any)["total-rate"] || 0}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Status:</h4>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  individualEvaluation.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : individualEvaluation.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : individualEvaluation.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {individualEvaluation.status || "Unknown"}
              </span>
            </div>

            {/* Reviewer Result */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                Reviewer Result:
              </h4>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  (individualEvaluation as any)["reviewer-result"]
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {(individualEvaluation as any)["reviewer-result"]
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

            {/* Evaluation Stage ID */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Stage ID:</h4>
              <p className="text-sm text-gray-600 font-mono">
                {individualEvaluation["evaluation-stage-id"]}
              </p>
            </div>
          </div>

          {/* Submitted At */}
          {(individualEvaluation as any)["submitted-at"] && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">
                  Submitted At:
                </h4>
                <p className="text-sm text-gray-600">
                  {new Date(
                    (individualEvaluation as any)["submitted-at"]
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
