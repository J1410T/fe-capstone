import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { ResponsiveTinyMCEViewer } from "@/components/ui/responsive-tinymce-viewer";
import {
  ArrowLeft,
  User,
  Calendar,
  Star,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useGetIndividualEvaluationById } from "@/hooks/queries/evaluation";
import TinyMCEViewerComponent from "@/components/ui/TinyMCE/TinyMCEViewer";
import { Loading } from "@/components";

export const IndividualEvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { evaluationId } = useParams<{ evaluationId: string }>();

  const {
    data: evaluationData,
    isLoading,
    error,
  } = useGetIndividualEvaluationById(evaluationId || "");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "created":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const getRecommendationColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";
  };

  const getRecommendationText = (
    isApproved: boolean,
    reviewerResult: unknown
  ) => {
    if (isApproved) return "Approved";
    if (reviewerResult) return "Approve with Revisions";
    return "Needs Review";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            Error loading evaluation details
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!evaluationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Evaluation not found</div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const evaluation = evaluationData;
  const evaluationDocument = evaluation.documents?.[0];

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-4 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Proposal
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Individual Evaluation Detail
            </h1>
            <p className="text-gray-600 mt-1">{evaluation.name}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Evaluation Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Evaluation Overview
                  </h3>
                  <p className="text-sm text-gray-500">
                    Comprehensive evaluation details and summary
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={getStatusColor(evaluation.status)}
                >
                  {evaluation.status}
                </Badge>
                {evaluation["is-approved"] && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    Evaluator
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {evaluation["reviewer-name"] || "Unknown Evaluator"}
                </p>
                <p className="text-xs text-gray-600">
                  {evaluation["reviewer-email"] || "No email provided"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                    Total Rate
                  </span>
                </div>
                {evaluation["total-rate"] !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {evaluation["total-rate"]}/100
                    </span>
                    <Badge
                      variant="outline"
                      className={getScoreColor(evaluation["total-rate"])}
                    >
                      {evaluation["total-rate"] >= 80
                        ? "Excellent"
                        : evaluation["total-rate"] >= 60
                        ? "Good"
                        : "Needs Improvement"}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Not rated</span>
                )}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    Type
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {evaluation["is-ai-report"] ? "AI Report" : "Manual Review"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                    Submitted
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {evaluation["submitted-at"]
                    ? new Date(evaluation["submitted-at"]).toLocaleDateString()
                    : "Not submitted"}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Recommendation:
                </span>
                <Badge
                  variant="outline"
                  className={getRecommendationColor(evaluation["is-approved"])}
                >
                  {getRecommendationText(
                    evaluation["is-approved"],
                    evaluation["reviewer-result"]
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Evaluation Document */}
          {evaluationDocument && evaluationDocument["content-html"] && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {evaluationDocument.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Detailed evaluation document and analysis
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <TinyMCEViewerComponent
                    content={evaluationDocument["content-html"]}
                    height={400}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {evaluation.comment && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Evaluator Comments
                    </h3>
                    <p className="text-sm text-gray-600">
                      Additional notes and feedback from the evaluator
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <TinyMCEViewerComponent
                    content={evaluation.comment}
                    height={400}
                  />
                </div>
              </div>
            </div>
          )}

          {/* No Content Fallback */}
          {!evaluationDocument?.["content-html"] && !evaluation.comment && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-8 text-center">
              <img
                src="https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg"
                alt="No evaluation content"
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 opacity-50"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Evaluation Content Available
              </h3>
              <p className="text-gray-600">
                This evaluation does not have detailed content or comments yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualEvaluationDetailPage;
