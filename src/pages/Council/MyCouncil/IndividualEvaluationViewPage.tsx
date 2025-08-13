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
            <p className="text-gray-500">
              Không tìm thấy individual evaluation
            </p>
            <Button
              variant="outline"
              onClick={handleBackToStage}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại Stage
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
            Individual Evaluation
          </h1>
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
            <CardDescription>Nội dung chi tiết của đánh giá</CardDescription>
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
                <p>Chưa có nội dung đánh giá</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Evaluation Stage ID:
              </h4>
              <p className="text-sm text-gray-600 font-mono">
                {individualEvaluation["evaluation-stage-id"]}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Evaluation ID:
              </h4>
              <p className="text-sm text-gray-600 font-mono">
                {individualEvaluation.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndividualEvaluationViewPage;
