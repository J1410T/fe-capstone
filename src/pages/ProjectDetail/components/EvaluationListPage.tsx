import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Calendar } from "lucide-react";
import { ProjectEvaluation, EvaluationType } from "@/types/task";
import { getProjectEvaluationsByProject } from "../data/mockEvaluationData";
import { useAuth } from "@/contexts/AuthContext";
import { canCreateEvaluation } from "@/utils/evaluationPermissions";

export const EvaluationListPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<ProjectEvaluation[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Check user permissions
  const hasCreatePermission = canCreateEvaluation(user);

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      getProjectEvaluationsByProject(projectId)
        .then(setEvaluations)
        .finally(() => setIsLoading(false));
    }
  }, [projectId]);

  const handleBack = () => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateEvaluation = () => {
    // Navigate to create evaluation page or open modal
    console.log("Create new evaluation");
  };

  const handleViewStage = (evaluationId: string, stageId: string) => {
    navigate(`/evaluation/${evaluationId}/stage/${stageId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: EvaluationType) => {
    switch (type) {
      case "milestone":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "midterm":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "summary":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "final":
        return "bg-red-100 text-red-800 border-red-200";
      case "proposal":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredEvaluations = evaluations.filter(
    (evaluation) => selectedType === "all" || evaluation.type === selectedType
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading evaluations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Project Evaluations
            </h1>
            <p className="text-gray-600">
              Manage and view all project evaluations
            </p>
          </div>
        </div>
        {hasCreatePermission && (
          <Button
            onClick={handleCreateEvaluation}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Evaluation
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Filter Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evaluation Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select evaluation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="midterm">Mid-term</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredEvaluations.length} of {evaluations.length}{" "}
              evaluations
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations List */}
      <div className="space-y-4">
        {filteredEvaluations.length > 0 ? (
          filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {evaluation.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={getTypeColor(evaluation.type)}
                      >
                        {evaluation.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getStatusColor(evaluation.status)}
                      >
                        {evaluation.status}
                      </Badge>
                    </div>
                    {evaluation.description && (
                      <CardDescription className="text-sm text-gray-600">
                        {evaluation.description}
                      </CardDescription>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {formatDate(evaluation.createdAt)}</span>
                      </div>
                      {evaluation.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {formatDate(evaluation.dueDate)}</span>
                        </div>
                      )}
                      <span>{evaluation.stages.length} stages</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={evaluation.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-sm font-medium">
                        View Evaluation Stages ({evaluation.stages.length})
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-3">
                        {evaluation.stages.map((stage) => (
                          <div
                            key={stage.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {stage.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {stage.individualEvaluations.length}{" "}
                                  individual evaluations
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={getStatusColor(stage.status)}
                              >
                                {stage.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewStage(evaluation.id, stage.id)
                                }
                              >
                                View Stage
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-sm">
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No Evaluations Found</p>
                <p className="text-sm">
                  {selectedType === "all"
                    ? "No evaluations have been created for this project yet."
                    : `No ${selectedType} evaluations found.`}
                </p>
                {hasCreatePermission && (
                  <Button
                    onClick={handleCreateEvaluation}
                    className="mt-4 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Evaluation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EvaluationListPage;
