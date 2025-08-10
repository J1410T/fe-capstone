import React from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Play,
  Circle,
  Users,
  FileText,
  Eye,
  UserCheck,
  XCircle,
  Award,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { EnhancedMilestone } from "./types";

interface MilestoneCardProps {
  milestone: EnhancedMilestone;
  onOpenSidePanel: (
    type: "evaluation" | "milestone",
    data: EnhancedMilestone | Record<string, unknown>
  ) => void;
  onApprove?: (milestoneId: string) => void;
  onReject?: (milestoneId: string) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onOpenSidePanel,
  onApprove,
  onReject,
}) => {
  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "ongoing":
        return <Play className="w-5 h-5 text-blue-600" />;
      case "upcoming":
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEvaluationStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "pending":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Milestone Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getMilestoneStatusIcon(milestone.status)}
          <div>
            <h5 className="text-lg font-semibold text-gray-900">
              {milestone.title}
            </h5>
            <p className="text-base text-gray-600">
              Due: {new Date(milestone.scheduledDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StatusBadge status={milestone.status} type="milestone" size="md" />
      </div>

      {/* Milestone Description */}
      {milestone.description && (
        <div className="mb-4">
          <p className="text-base text-gray-700 leading-relaxed">
            {milestone.description}
          </p>
        </div>
      )}

      {/* Evaluation Section */}
      {milestone.evaluationStage && (
        <div
          className={`p-4 rounded-lg border mb-4 ${getEvaluationStatusColor(
            milestone.evaluationData?.status
          )}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h6 className="text-base font-semibold text-gray-900 flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Evaluation Status
            </h6>
            <StatusBadge
              status={
                milestone.evaluationData?.status || milestone.evaluationStage
              }
              type="milestone"
              size="sm"
            />
          </div>

          {/* Evaluators */}
          {milestone.evaluators && milestone.evaluators.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Evaluators: {milestone.evaluators.join(", ")}</span>
              </div>
            </div>
          )}

          {/* Evaluation Score */}
          {milestone.evaluationData?.score && (
            <div className="mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Score:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {milestone.evaluationData.score}/10
                </span>
              </div>
            </div>
          )}

          {/* Evaluation Comments */}
          {milestone.evaluationData?.comments && (
            <div className="mb-3">
              <p className="text-sm text-gray-700 italic">
                "{milestone.evaluationData.comments}"
              </p>
            </div>
          )}

          {/* Evaluation Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenSidePanel("milestone", milestone)}
              className="text-sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>

            {milestone.evaluationData?.status === "pending" && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApprove?.(milestone.id)}
                  className="text-sm text-green-700 border-green-300 hover:bg-green-50"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject?.(milestone.id)}
                  className="text-sm text-red-700 border-red-300 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents */}
      {milestone.documents && milestone.documents.length > 0 && (
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              {milestone.documents.length} document(s)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenSidePanel("milestone", milestone)}
              className="text-sm"
            >
              View All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
