import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Eye, CheckCircle, Clock } from "lucide-react";
import {
  EvaluationOverview as EvaluationOverviewType,
  EvaluationStage as EvaluationStageType,
} from "../types";
import EvaluationOverview from "./EvaluationOverview";
import EvaluationStage from "./EvaluationStage";

interface EvaluationDetailViewProps {
  evaluationOverview: EvaluationOverviewType;
  onBack?: () => void;
  onCreateEvaluation?: () => void;
  className?: string;
}

type ViewMode = "overview" | "evaluation-stage";

export const EvaluationDetailView: React.FC<EvaluationDetailViewProps> = ({
  evaluationOverview,
  onBack,
  onCreateEvaluation,
  className = "",
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>("overview");
  const [selectedStage, setSelectedStage] =
    useState<EvaluationStageType | null>(null);

  // Mock evaluation stages - in real app this would come from props or API
  const evaluationStages: EvaluationStageType[] = [
    {
      id: "stage-1",
      name: "Initial Review",
      description: "Initial assessment of proposal feasibility and alignment",
      order: 1,
      status: "completed",
      dueDate: "2024-01-25T23:59:59Z",
      evaluations: evaluationOverview.evaluations.slice(0, 2),
    },
    {
      id: "stage-2",
      name: "Technical Assessment",
      description: "Detailed technical evaluation of methodology and approach",
      order: 2,
      status: "in_progress",
      dueDate: "2024-02-15T23:59:59Z",
      evaluations: evaluationOverview.evaluations.slice(2),
    },
    {
      id: "stage-3",
      name: "Final Review",
      description: "Final decision and recommendation compilation",
      order: 3,
      status: "not_started",
      dueDate: "2024-03-01T23:59:59Z",
      evaluations: [],
    },
  ];

  const navigateToStage = (stage: EvaluationStageType) => {
    setSelectedStage(stage);
    setCurrentView("evaluation-stage");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedStage(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Council Evaluations
            </h2>
            <p className="text-gray-600">
              Detailed evaluation results and individual assessments
            </p>
          </div>
        </div>
      </div>

      {/* Content based on current view */}
      {currentView === "overview" && (
        <div className="space-y-6">
          {/* Evaluation Overview */}
          <EvaluationOverview evaluationOverview={evaluationOverview} />

          {/* Individual Evaluation Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Evaluation Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Click on any evaluation stage to view detailed assessment and
                  provide feedback.
                </p>
                <div className="grid gap-4">
                  {evaluationStages.map((stage) => {
                    const totalEvaluations = stage.evaluations.length;

                    return (
                      <div
                        key={stage.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                            {stage.order}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {stage.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {stage.description}
                            </p>
                            {stage.dueDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Due:{" "}
                                {new Date(stage.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              {totalEvaluations} evaluations
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {stage.status === "completed" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : stage.status === "in_progress" ? (
                              <Clock className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                stage.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : stage.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              {stage.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateToStage(stage)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Stage
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentView === "evaluation-stage" && selectedStage && (
        <EvaluationStage
          stage={selectedStage}
          onBack={handleBackToOverview}
          onCreateEvaluation={(stageId: string) => {
            console.log("Creating new evaluation for stage:", stageId);
            if (onCreateEvaluation) {
              onCreateEvaluation();
            }
          }}
          showHeader={false}
        />
      )}
    </div>
  );
};

export default EvaluationDetailView;
