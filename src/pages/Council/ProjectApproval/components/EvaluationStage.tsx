import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Plus,
  Users,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { CouncilEvaluation } from "../types";
import IndividualEvaluationStage from "./IndividualEvaluationStage";

interface EvaluationStageData {
  id: string;
  name: string;
  description: string;
  order: number;
  status: "not_started" | "in_progress" | "completed";
  evaluations: CouncilEvaluation[];
  dueDate?: string;
}

interface EvaluationStageProps {
  stage: EvaluationStageData;
  onBack?: () => void;
  onCreateEvaluation?: (stageId: string) => void;
  className?: string;
  showHeader?: boolean; // Control whether to show the header section
}

type ViewMode = "stage-overview" | "individual-evaluation";

interface BreadcrumbItem {
  id: string;
  label: string;
  type: "stage" | "evaluation";
  data?: CouncilEvaluation;
}

export const EvaluationStage: React.FC<EvaluationStageProps> = ({
  stage,
  onBack,
  onCreateEvaluation,
  className = "",
  showHeader = true,
}) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewMode>("stage-overview");
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<CouncilEvaluation | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "stage", label: stage.name, type: "stage" },
  ]);

  const navigateToEvaluation = (evaluation: CouncilEvaluation) => {
    setSelectedEvaluation(evaluation);
    setCurrentView("individual-evaluation");
    setBreadcrumbs([
      { id: "stage", label: stage.name, type: "stage" },
      {
        id: `eval-${evaluation.id}`,
        label: `${evaluation.evaluatorName} Evaluation`,
        type: "evaluation",
        data: evaluation,
      },
    ]);
  };

  const navigateToBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    const index = breadcrumbs.findIndex((b) => b.id === breadcrumb.id);
    if (index !== -1) {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);

      switch (breadcrumb.type) {
        case "stage":
          setCurrentView("stage-overview");
          setSelectedEvaluation(null);
          break;
        case "evaluation":
          setCurrentView("individual-evaluation");
          setSelectedEvaluation(breadcrumb.data || null);
          break;
      }
    }
  };

  const handleBackToStage = () => {
    setCurrentView("stage-overview");
    setSelectedEvaluation(null);
    setBreadcrumbs([{ id: "stage", label: stage.name, type: "stage" }]);
  };

  const getStageStatusConfig = (status: EvaluationStageData["status"]) => {
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
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Not Started",
        };
    }
  };

  const getEvaluationStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEvaluationStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stageStatusConfig = getStageStatusConfig(stage.status);
  const StageStatusIcon = stageStatusConfig.icon;

  if (currentView === "individual-evaluation" && selectedEvaluation) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.id}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => navigateToBreadcrumb(breadcrumb)}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <IndividualEvaluationStage
          evaluation={selectedEvaluation}
          onBack={handleBackToStage}
          onSave={(updatedEvaluation: CouncilEvaluation) => {
            console.log("Saving evaluation:", updatedEvaluation);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-6 w-6" />
                {stage.name}
              </h2>
              <p className="text-gray-600">{stage.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={stageStatusConfig.badgeClass}>
              <StageStatusIcon className="h-4 w-4 mr-1" />
              {stageStatusConfig.label}
            </Badge>
            {onCreateEvaluation && (
              <Button
                onClick={() =>
                  navigate(
                    `/council/project-approval/create-evaluation?stageId=${
                      stage.id
                    }&stageName=${encodeURIComponent(stage.name)}`
                  )
                }
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Evaluation
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Individual Evaluations in this Stage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Individual Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Click on any evaluation to view details and provide individual
              assessment.
            </p>
            <div className="grid gap-4">
              {stage.evaluations.map((evaluation, index) => (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {evaluation.evaluatorName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {evaluation.evaluatorRole}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getEvaluationStatusIcon(evaluation.status)}
                      <Badge
                        variant="outline"
                        className={`text-xs ${getEvaluationStatusBadgeClass(
                          evaluation.status
                        )}`}
                      >
                        {evaluation.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToEvaluation(evaluation)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {stage.evaluations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No evaluations created for this stage yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationStage;
