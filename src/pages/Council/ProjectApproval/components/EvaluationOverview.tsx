import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, Eye, FileText } from "lucide-react";
import { EvaluationOverview as EvaluationOverviewType } from "../types";

interface EvaluationOverviewProps {
  evaluationOverview: EvaluationOverviewType;
  onViewDetails?: () => void;
  className?: string;
}

const getRecommendationConfig = (recommendation: string) => {
  switch (recommendation) {
    case "approve":
      return {
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        badgeClass: "bg-green-100 text-green-800 border-green-200",
        label: "Approve",
        icon: CheckCircle,
      };
    case "reject":
      return {
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
        label: "Reject",
        icon: AlertCircle,
      };
    case "revise":
      return {
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Revise",
        icon: Clock,
      };
    default:
      return {
        color: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Pending",
        icon: Clock,
      };
  }
};

export const EvaluationOverview: React.FC<EvaluationOverviewProps> = ({
  evaluationOverview,
  onViewDetails,
  className = "",
}) => {
  const recommendationConfig = getRecommendationConfig(
    evaluationOverview.overallRecommendation
  );
  const RecommendationIcon = recommendationConfig.icon;

  return (
    <Card
      className={`${recommendationConfig.bgColor} ${recommendationConfig.borderColor} ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-gray-600" />
            <span className="text-xl">Council Evaluations Overview</span>
          </div>
          <Badge variant="outline" className={recommendationConfig.badgeClass}>
            <RecommendationIcon className="h-4 w-4 mr-1" />
            {recommendationConfig.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Evaluator Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Council Members</h4>
          <div className="space-y-2">
            {evaluationOverview.evaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {evaluation.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : evaluation.status === "in_progress" ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : evaluation.status === "overdue" ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {evaluation.evaluatorName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {evaluation.evaluatorRole}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      evaluation.status === "completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : evaluation.status === "in_progress"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : evaluation.status === "overdue"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {evaluation.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {onViewDetails && (
          <div className="flex justify-center pt-4 border-t">
            <Button onClick={onViewDetails} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Detailed Evaluations
            </Button>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Last updated:{" "}
          {new Date(evaluationOverview.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationOverview;
