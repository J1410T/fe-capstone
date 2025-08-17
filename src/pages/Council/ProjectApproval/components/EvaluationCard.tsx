import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Eye,
  Edit,
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

interface EvaluationCardProps {
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
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        badgeClass: "bg-green-100 text-green-800 border-green-200",
        label: "Completed",
      };
    case "in_progress":
      return {
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
        label: "In Progress",
      };
    case "overdue":
      return {
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
        label: "Overdue",
      };
    default:
      return {
        icon: Clock,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Pending",
      };
  }
};

const getRecommendationConfig = (
  recommendation: Evaluation["recommendation"]
) => {
  switch (recommendation) {
    case "approve":
      return {
        color: "text-green-700",
        badgeClass: "bg-green-100 text-green-800 border-green-200",
        label: "Approve",
      };
    case "reject":
      return {
        color: "text-red-700",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
        label: "Reject",
      };
    case "revise":
      return {
        color: "text-amber-700",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Revise",
      };
    default:
      return {
        color: "text-gray-700",
        badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Pending",
      };
  }
};

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  title,
  showDetails = true,
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

  const isOverdue =
    evaluation.dueDate &&
    new Date(evaluation.dueDate) < new Date() &&
    evaluation.status !== "completed";

  // Check if current user can edit this specific evaluation
  const canEditThisEvaluation = canEditSpecificEvaluation(
    user,
    evaluation.evaluatorId
  );

  const generateEvaluationContent = (): string => {
    return `
      <h3>Evaluation Report - ${evaluation.evaluatorName}</h3>

      <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; color: #495057;">Evaluation Summary</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; background-color: #e9ecef;">Evaluator:</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${
              evaluation.evaluatorName
            } (${evaluation.evaluatorRole})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; background-color: #e9ecef;">Status:</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${
              statusConfig.label
            }</td>
          </tr>
          ${
            evaluation.status === "completed"
              ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; background-color: #e9ecef;">Total Score:</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${evaluation.totalScore}/${evaluation.maxTotalScore}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; background-color: #e9ecef;">Recommendation:</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${recommendationConfig.label}</td>
          </tr>
          `
              : ""
          }
          ${
            evaluation.submittedAt
              ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; background-color: #e9ecef;">Submitted:</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${new Date(
              evaluation.submittedAt
            ).toLocaleDateString()}</td>
          </tr>
          `
              : evaluation.dueDate
              ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; background-color: #e9ecef;">Due Date:</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${new Date(
              evaluation.dueDate
            ).toLocaleDateString()}${isOverdue ? " (Overdue)" : ""}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>

      ${
        evaluation.status === "completed" && evaluation.criteria.length > 0
          ? `
      <h4>Evaluation Criteria Scores</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #e9ecef;">
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">Criteria</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: center;">Score</th>
            <th style="padding: 12px; border: 1px solid #dee2e6; text-align: center;">Weight</th>
          </tr>
        </thead>
        <tbody>
          ${evaluation.criteria
            .map(
              (criteria) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${
              criteria.name
            }</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">${
              criteria.score
            }/${criteria.maxScore}</td>
            <td style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">${
              criteria.weight
            }%</td>
          </tr>
          ${
            criteria.comments
              ? `
          <tr>
            <td colspan="4" style="padding: 8px; border: 1px solid #dee2e6; background-color: #f8f9fa; font-style: italic;">
              <strong>Comments:</strong> ${criteria.comments}
            </td>
          </tr>
          `
              : ""
          }
          `
            )
            .join("")}
        </tbody>
      </table>
      `
          : ""
      }

      ${
        evaluation.overallComments
          ? `
      <h4>Overall Comments</h4>
      <div style="background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 16px; margin-bottom: 20px;">
        <p style="margin: 0; line-height: 1.6;">${evaluation.overallComments}</p>
      </div>
      `
          : ""
      }

      ${
        evaluation.status !== "completed"
          ? `
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 16px; margin-top: 20px;">
        <p style="margin: 0; color: #856404;">
          <strong>Note:</strong> This evaluation is ${
            evaluation.status === "in_progress"
              ? "currently in progress"
              : "pending"
          }.
          The content will be updated once the evaluation is completed.
        </p>
      </div>
      `
          : ""
      }

      <div style="margin-top: 30px; padding: 15px; background-color: #e7f3ff; border-left: 4px solid #007bff; border-radius: 4px;">
        <p style="margin: 0; font-style: italic; color: #0056b3;">
          <strong>Evaluation ID:</strong> ${evaluation.id} |
          <strong>Last Updated:</strong> ${new Date(
            evaluation.lastUpdated
          ).toLocaleString()}
        </p>
      </div>
    `;
  };

  return (
    <Card
      className={`${statusConfig.bgColor} ${statusConfig.borderColor} ${className}`}
    >
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="text-lg">{title || "Evaluation"}</span>
          </div>
          <Badge variant="outline" className={statusConfig.badgeClass}>
            {statusConfig.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Evaluator Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <span className="font-medium text-sm">
                {evaluation.evaluatorName}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({evaluation.evaluatorRole})
              </span>
            </div>
          </div>
        </div>

        {/* Score Summary (for completed evaluations) */}
        {evaluation.status === "completed" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Score</span>
              <span className="font-semibold text-lg">
                {evaluation.totalScore}/{evaluation.maxTotalScore}
              </span>
            </div>
          </div>
        )}

        {/* Recommendation */}
        {evaluation.recommendation !== "pending" && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Recommendation:</span>
            <Badge
              variant="outline"
              className={recommendationConfig.badgeClass}
            >
              {recommendationConfig.label}
            </Badge>
          </div>
        )}

        {/* Due Date / Submission Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          {evaluation.status === "completed" && evaluation.submittedAt ? (
            <span>
              Submitted: {new Date(evaluation.submittedAt).toLocaleDateString()}
            </span>
          ) : evaluation.dueDate ? (
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              Due: {new Date(evaluation.dueDate).toLocaleDateString()}
              {isOverdue && " (Overdue)"}
            </span>
          ) : (
            <span className="text-gray-500">No due date set</span>
          )}
        </div>

        {showDetails && !compact && (
          <>
            {/* Overall Comments */}
            {evaluation.overallComments && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Comments</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {evaluation.overallComments.length > 150
                    ? `${evaluation.overallComments.substring(0, 150)}...`
                    : evaluation.overallComments}
                </p>
              </div>
            )}

            {/* Top Criteria (for completed evaluations) */}
            {evaluation.status === "completed" &&
              evaluation.criteria.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Evaluation Criteria
                  </h4>
                  <div className="space-y-2">
                    {evaluation.criteria.slice(0, 3).map((criteria) => (
                      <div
                        key={criteria.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">{criteria.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {criteria.score}/{criteria.maxScore}
                          </span>
                          <span className="text-xs text-gray-500">
                            (
                            {(
                              (criteria.score / criteria.maxScore) *
                              100
                            ).toFixed(0)}
                            %)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}

        {/* Detailed Evaluation Content */}
        {!compact && showDetails && (
          <div className="mt-4">
            <EnhancedTinyMCEViewer
              content={generateEvaluationContent()}
              title="Detailed Evaluation Report"
              height={400}
              editable={false}
              showHeader={false}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Updated: {new Date(evaluation.lastUpdated).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewDetails}
                className="h-6 px-2 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            {onEdit &&
              evaluation.status !== "completed" &&
              canEditThisEvaluation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="h-6 px-2 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationCard;
