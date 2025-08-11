import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Edit,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { CouncilEvaluation } from "../types";
import EnhancedTinyMCEViewer from "./EnhancedTinyMCEViewer";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { canEditSpecificEvaluation } from "@/utils/evaluationPermissions";

interface IndividualEvaluationStageProps {
  evaluation: CouncilEvaluation;
  onBack?: () => void;
  onSave?: (updatedEvaluation: CouncilEvaluation) => void;
  editable?: boolean;
  className?: string;
}

export const IndividualEvaluationStage: React.FC<
  IndividualEvaluationStageProps
> = ({ evaluation, onSave, editable = true, className = "" }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvaluation, setEditedEvaluation] =
    useState<CouncilEvaluation>(evaluation);
  const [isSaving, setIsSaving] = useState(false);

  // Check if current user can edit this specific evaluation
  const canEdit =
    canEditSpecificEvaluation(user, evaluation.evaluatorId) && editable;

  const getStatusConfig = (status: CouncilEvaluation["status"]) => {
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

  const statusConfig = getStatusConfig(editedEvaluation.status);
  const StatusIcon = statusConfig.icon;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Update the evaluation with current timestamp
      const updatedEvaluation = {
        ...editedEvaluation,
        lastUpdated: new Date().toISOString(),
        submittedAt:
          editedEvaluation.status === "completed"
            ? new Date().toISOString()
            : editedEvaluation.submittedAt,
      };

      if (onSave) {
        await onSave(updatedEvaluation);
      }

      setIsEditing(false);
      toast.success("Evaluation saved successfully!");
    } catch (error) {
      console.error("Failed to save evaluation:", error);
      toast.error("Failed to save evaluation. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedEvaluation(evaluation);
    setIsEditing(false);
  };

  const generateDefaultEvaluationContent = (): string => {
    return `
      <h3>Evaluation Report - ${editedEvaluation.evaluatorName}</h3>
      
      <h4>Evaluator Information</h4>
      <p><strong>Name:</strong> ${editedEvaluation.evaluatorName}<br>
      <strong>Role:</strong> ${editedEvaluation.evaluatorRole}<br>
      <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h4>Overall Assessment</h4>
      <p>Please provide your detailed evaluation of the proposal here...</p>
      
      <h4>Strengths</h4>
      <ul>
        <li>Add key strengths of the proposal</li>
      </ul>
      
      <h4>Areas for Improvement</h4>
      <ul>
        <li>Add suggestions for improvement</li>
      </ul>
      
      <h4>Recommendation</h4>
      <p>Based on the evaluation criteria, I recommend...</p>
    `;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={statusConfig.badgeClass}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusConfig.label}
          </Badge>
          {canEdit && (
            <>
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detailed Evaluation Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedTinyMCEViewer
            content={
              editedEvaluation.evaluationContent ||
              generateDefaultEvaluationContent()
            }
            height={600}
            editable={isEditing}
            showHeader={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default IndividualEvaluationStage;
