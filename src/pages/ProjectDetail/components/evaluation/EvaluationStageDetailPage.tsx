import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Users, Plus, Eye, Trash2 } from "lucide-react";
import { EvaluationStage } from "@/types/task";

interface EvaluationStageDetailPageProps {
  evaluationStage?: EvaluationStage;
}

const EvaluationStageDetailPage: React.FC<EvaluationStageDetailPageProps> = ({
  evaluationStage,
}) => {
  const navigate = useNavigate();
  const { projectId, stageId } = useParams<{
    projectId: string;
    stageId: string;
  }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data if no evaluationStage provided
  const stage = evaluationStage || {
    id: stageId || "",
    name: "Milestone Evaluation",
    type: "milestone",
    phrase: "Phase 1",
    stageOrder: 1,
    status: "in_progress",
    title: "Milestone Evaluation",
    individualEvaluations: [
      {
        id: "1",
        totalRate: 85,
        comment: "Good progress on the project",
        submittedAt: "2024-01-15",
        isApproved: true,
        reviewerResult: true,
        isAIReport: false,
        status: "completed",
        evaluationStageId: stageId || "",
        reviewerId: "reviewer1",
        projectId: projectId || "",
        milestoneId: "milestone1",
        evaluator: "Dr. John Smith",
      },
      {
        id: "2",
        totalRate: 0,
        comment: "",
        submittedAt: "",
        isApproved: false,
        reviewerResult: false,
        isAIReport: false,
        status: "pending",
        evaluationStageId: stageId || "",
        reviewerId: "reviewer2",
        projectId: projectId || "",
        milestoneId: "milestone1",
        evaluator: "Dr. Jane Doe",
      },
    ],
  };

  const handleGoBack = () => {
    navigate(`/project/${projectId}/evaluation`);
  };

  const handleCreateIndividualEvaluation = () => {
    navigate(
      `/project/${projectId}/evaluation/stage/${stageId}/create-individual`
    );
  };

  const handleViewIndividualEvaluation = (individualId: string) => {
    navigate(`/project/${projectId}/evaluation/individual/${individualId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800">{score}/100</Badge>;
    } else if (score >= 60) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">{score}/100</Badge>
      );
    } else if (score > 0) {
      return <Badge className="bg-red-100 text-red-800">{score}/100</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">Not Scored</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-white/20">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Evaluations
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {stage.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {stage.type} • {stage.phrase}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(stage.status)}
                <Button
                  onClick={handleCreateIndividualEvaluation}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Individual Evaluation
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="evaluations">
                  Individual Evaluations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Stage Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                            Total Evaluations
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stage.individualEvaluations?.length || 0}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-50 rounded-xl">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                            Completed
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stage.individualEvaluations?.filter(
                              (e) => e.status === "completed"
                            ).length || 0}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-50 rounded-xl">
                          <FileText className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">
                            Pending
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stage.individualEvaluations?.filter(
                              (e) => e.status === "pending"
                            ).length || 0}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Stage Description */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Stage Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Type
                        </label>
                        <p className="text-base text-gray-900">{stage.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Phase
                        </label>
                        <p className="text-base text-gray-900">
                          {stage.phrase}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Stage Order
                        </label>
                        <p className="text-base text-gray-900">
                          {stage.stageOrder}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="evaluations" className="mt-6">
                <div className="space-y-4">
                  {stage.individualEvaluations?.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900 mb-1">
                              No individual evaluations found
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                              Start by creating your first individual evaluation
                            </p>
                            <Button
                              onClick={handleCreateIndividualEvaluation}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create Individual Evaluation
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {stage.individualEvaluations?.map((evaluation) => (
                        <Card
                          key={evaluation.id}
                          className="p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-50 rounded-xl">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {evaluation.evaluator || "Evaluator"}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {evaluation.submittedAt
                                    ? `Submitted: ${evaluation.submittedAt}`
                                    : "Not submitted"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {getScoreBadge(evaluation.totalRate)}
                              {getStatusBadge(evaluation.status)}
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewIndividualEvaluation(
                                      evaluation.id
                                    )
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                {evaluation.status === "pending" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          {evaluation.comment && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                {evaluation.comment}
                              </p>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvaluationStageDetailPage;
