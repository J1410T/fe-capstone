import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIEvaluationDisplay } from "@/components/ui/ai-evaluation-display";
import {
  ArrowLeft,
  Bot,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { useGetIndividualEvaluationById } from "@/hooks/queries/evaluation";
import { IndividualEvaluationApi } from "@/types/evaluation";
import { Loading } from "@/components";

export const AIEvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { evaluationId } = useParams<{ evaluationId: string }>();

  const {
    data: AIEvaluationData,
    isLoading,
    error,
  } = useGetIndividualEvaluationById(evaluationId || "");

  const [aiEvaluation, setAiEvaluation] =
    useState<IndividualEvaluationApi | null>(null);

  // Update aiEvaluation when data changes
  useEffect(() => {
    if (AIEvaluationData) {
      setAiEvaluation(AIEvaluationData);
    }
  }, [AIEvaluationData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loading />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Evaluation
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load evaluation details
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // No data state
  if (!aiEvaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Evaluation Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested evaluation could not be found
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Evaluation Details
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed view of AI-generated evaluation
                </p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-transparent"></div>
        </div>

        {/* AI Evaluation Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {aiEvaluation.name}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-3 py-1 text-xs"
                >
                  AI Generated
                </Badge>
                <Badge
                  variant="outline"
                  className={`font-medium px-3 py-1 text-xs ${getStatusColor(
                    aiEvaluation.status
                  )}`}
                >
                  {aiEvaluation.status}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Submitted{" "}
                    {new Date(
                      aiEvaluation["submitted-at"]
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Evaluation ID
                </span>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {aiEvaluation.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
              <Star className="h-8 w-8 text-purple-600" />
              <div>
                <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                  Total Rate
                </span>
                <p className="text-lg font-semibold text-gray-900">
                  {aiEvaluation["total-rate"]
                    ? `${aiEvaluation["total-rate"]}/100`
                    : "Not Rated"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
              {aiEvaluation["reviewer-result"] ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-orange-600" />
              )}
              <div>
                <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                  Approval Status
                </span>
                <p className="text-lg font-semibold text-gray-900">
                  {aiEvaluation["reviewer-result"] ? "Approved" : "Rejected"}
                </p>
              </div>
            </div>
          </div>

          {/* AI Analysis Content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <AIEvaluationDisplay
              content={aiEvaluation.comment || "No comment available"}
              title="AI Analysis & Commentary"
              score={aiEvaluation["total-rate"]}
              status={aiEvaluation.status}
              submittedAt={aiEvaluation["submitted-at"]}
              showProjectDetails={true}
              className="w-full"
              compact={false}
            />
          </div>

          {/* Technical Details */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Technical Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Stage ID:</span>
                <p className="text-gray-600 font-mono break-all">
                  {aiEvaluation["evaluation-stage-id"]}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Reviewer ID:</span>
                <p className="text-gray-600">
                  {aiEvaluation["reviewer-id"] || "System Generated"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Documents:</span>
                <p className="text-gray-600">
                  {aiEvaluation.documents ? "Available" : "None"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Similarity Check:
                </span>
                <p className="text-gray-600">
                  {aiEvaluation["projects-similarity-result"]
                    ? "Completed"
                    : "Not Performed"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
