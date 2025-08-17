import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  Edit,
  Award,
} from "lucide-react";
import EnhancedTinyMCEViewer from "./EnhancedTinyMCEViewer";
import { useAuth } from "@/contexts/AuthContext";
import { canEditSpecificEvaluation } from "@/utils/evaluationPermissions";

export interface EvaluationCriteria {
  id: string;
  name: string;
  score: number; // 0-100
  maxScore: number;
  weight: number; // percentage
  comments?: string;
}

export interface Evaluation {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  submittedAt?: string;
  dueDate?: string;
  totalScore: number;
  maxTotalScore: number;
  recommendation: "approve" | "reject" | "revise" | "pending";
  overallComments?: string;
  criteria: EvaluationCriteria[];
  lastUpdated: string;
}

interface ModernEvaluationCardProps {
  evaluation: Evaluation;
  title?: string;
  showDetails?: boolean;
  onViewDetails?: () => void;
  onEdit?: () => void;
  className?: string;
  compact?: boolean;
}

const getStatusConfig = (status: Evaluation["status"]) => {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Completed",
        barColor: "bg-emerald-500",
      };
    case "in_progress":
      return {
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        label: "In Progress",
        barColor: "bg-blue-500",
      };
    case "overdue":
      return {
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeClass: "bg-red-50 text-red-700 border-red-200",
        label: "Overdue",
        barColor: "bg-red-500",
      };
    default:
      return {
        icon: Clock,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
        label: "Pending",
        barColor: "bg-gray-400",
      };
  }
};

const getRecommendationConfig = (
  recommendation: Evaluation["recommendation"]
) => {
  switch (recommendation) {
    case "approve":
      return {
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Approve",
      };
    case "reject":
      return {
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        badgeClass: "bg-red-50 text-red-700 border-red-200",
        label: "Reject",
      };
    case "revise":
      return {
        icon: Edit,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Needs Revision",
      };
    default:
      return {
        icon: Clock,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
        label: "Pending",
      };
  }
};

const ModernEvaluationCard: React.FC<ModernEvaluationCardProps> = ({
  evaluation,
  title,
  showDetails = false,
  onViewDetails,
  onEdit,
  className = "",
  compact = false,
}) => {
  const { user } = useAuth();
  const statusConfig = getStatusConfig(evaluation.status);
  const recommendationConfig = getRecommendationConfig(
    evaluation.recommendation
  );

  const canEdit = user && canEditSpecificEvaluation(user, evaluation.id);

  const scorePercentage =
    evaluation.status === "completed"
      ? Math.round((evaluation.totalScore / evaluation.maxTotalScore) * 100)
      : 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Status indicator bar */}
      <div className={`h-1 w-full ${statusConfig.barColor}`}></div>

      {/* Header */}
      <div className={`p-6 ${compact ? "pb-3" : "pb-4"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2.5 rounded-xl ${statusConfig.bgColor}`}>
              <FileText className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {title || "Evaluation"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {evaluation.evaluatorName}
                </span>
                <span className="text-xs text-gray-500">
                  ({evaluation.evaluatorRole})
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${statusConfig.badgeClass} font-medium px-3 py-1.5 flex items-center gap-1.5`}
          >
            <statusConfig.icon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-6">
        {/* Score Summary (for completed evaluations) */}
        {evaluation.status === "completed" && (
          <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-emerald-50 rounded-xl p-5 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    Overall Score
                  </span>
                  <p className="text-sm text-gray-600">
                    Final evaluation result
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {evaluation.totalScore}
                  <span className="text-xl text-gray-500">
                    /{evaluation.maxTotalScore}
                  </span>
                </div>
                <div className="text-sm font-medium text-emerald-600">
                  {scorePercentage}% Score
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-700 relative overflow-hidden"
                style={{ width: `${scorePercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation */}
        {evaluation.recommendation !== "pending" && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className={`p-2 rounded-lg ${recommendationConfig.bgColor}`}>
              <recommendationConfig.icon
                className={`h-5 w-5 ${recommendationConfig.color}`}
              />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                Recommendation:
              </span>
              <div
                className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium ${recommendationConfig.badgeClass}`}
              >
                {recommendationConfig.label}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {evaluation.submittedAt && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  Submitted
                </span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(evaluation.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {evaluation.dueDate && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Due Date
                </span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(evaluation.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Overall Comments */}
        {evaluation.overallComments && showDetails && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Overall Comments
            </h4>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <EnhancedTinyMCEViewer content={evaluation.overallComments} />
            </div>
          </div>
        )}

        {/* Criteria Breakdown (for completed evaluations with details) */}
        {showDetails &&
          evaluation.status === "completed" &&
          evaluation.criteria && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Evaluation Criteria
              </h4>
              <div className="space-y-3">
                {evaluation.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">
                        {criterion.name}
                      </span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          {criterion.score}
                        </span>
                        <span className="text-sm text-gray-500">
                          /{criterion.maxScore}
                        </span>
                        <div className="text-xs text-blue-600 font-medium">
                          Weight: {criterion.weight}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (criterion.score / criterion.maxScore) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    {criterion.comments && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <EnhancedTinyMCEViewer content={criterion.comments} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              {showDetails ? "Hide Details" : "View Details"}
            </Button>
          )}

          {canEdit && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Evaluation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernEvaluationCard;
