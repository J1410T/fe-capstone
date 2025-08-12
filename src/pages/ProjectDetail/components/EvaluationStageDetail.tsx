import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Eye, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import Header from "@/components/layout/header";

const EvaluationStageDetail: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const handleCreateIndividualEvaluation = () => {
    navigate(`/project/${projectId}/evaluation/create`);
  };

  const handleViewIndividualEvaluation = (individualEvaluationId: string) => {
    navigate(
      `/project/${projectId}/evaluation/individual/${individualEvaluationId}`
    );
  };

  const handleNavigateToEvaluation = () => {
    navigate(`/project/${projectId}`);
  };

  // Fake data (sẽ thay bằng API)
  const evaluations = [
    {
      id: "1",
      name: "Individual Evaluation - Council Member A",
      status: "completed",
      createdAt: "2025-08-10",
    },
    {
      id: "2",
      name: "Individual Evaluation - Council Member B",
      status: "in progress",
      createdAt: "2025-08-11",
    },
    {
      id: "3",
      name: "Individual Evaluation - Council Member C",
      status: "pending",
      createdAt: "2025-08-12",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="pt-4 flex items-center gap-2 text-sm text-gray-600 mt-15">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 flex items-center gap-1"
          onClick={handleNavigateToEvaluation}
        >
          <ChevronLeft className="w-4 h-4" /> Evaluation
        </Button>
        <span className="text-gray-400">/</span>
        <span className="font-medium text-gray-900">Evaluation Stage</span>
      </div>

      {/* Header Section */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Evaluation Stage Detail
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Stage 1</p>
              <p className="text-sm text-gray-600">review • project</p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCreateIndividualEvaluation}
            >
              <Plus className="w-4 h-4" />
              Create New Evaluation
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                created
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Evaluations</p>
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                3
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Progress</p>
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                33%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Evaluations Section */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Individual Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="flex justify-between items-center border rounded-lg p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors"
            >
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">{evaluation.name}</h3>
                <p className="text-xs text-gray-500">
                  Created: {evaluation.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-0.5",
                    getStatusColor(evaluation.status)
                  )}
                >
                  {evaluation.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleViewIndividualEvaluation(evaluation.id)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationStageDetail;
