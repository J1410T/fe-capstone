import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Bot, Calendar, FileText, ChevronLeft } from "lucide-react";
import { IndividualEvaluation } from "@/types/task";
import { EvaluationOverviewTab } from "./evaluation/EvaluationOverviewTab";
import { EvaluationDocumentTab } from "./evaluation/EvaluationDocumentTab";
import Header from "@/components/layout/header";

interface IndividualEvaluationDetailProps {
  evaluation?: IndividualEvaluation;
  stageName?: string;
}

const mockEvaluation: IndividualEvaluation = {
  id: "eval-1",
  totalRate: 8.5,
  comment:
    "Excellent research proposal with strong methodology and clear objectives. The team demonstrates good understanding of the problem domain.",
  submittedAt: "2024-01-15T10:30:00Z",
  isApproved: true,
  reviewerResult: true,
  isAIReport: false,
  status: "submitted",
  evaluationStageId: "stage-1",
  reviewerId: "reviewer-1",
  projectId: "proj-1",
  milestoneId: "milestone-1",
  evaluator: "Dr. Sarah Johnson",
  documentId: "doc-eval-1",
};

export const IndividualEvaluationDetail: React.FC<
  IndividualEvaluationDetailProps
> = ({ evaluation = mockEvaluation, stageName = "Evaluation Round 1" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { projectId } = evaluation;

  const handleNavigateToEvaluation = () => {
    navigate(`/project/${projectId}/evaluation`);
  };

  const handleNavigateToEvaluationStage = () => {
    navigate(
      `/project/${evaluation.projectId}/evaluation/stage/${evaluation.evaluationStageId}`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-15">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 flex items-center gap-1"
          onClick={handleNavigateToEvaluation}
        >
          <ChevronLeft className="w-4 h-4" /> Evaluation
        </Button>
        <span className="text-gray-400">/</span>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 flex items-center gap-1"
          onClick={handleNavigateToEvaluationStage}
        >
          Evaluation Stage
        </Button>
        <span className="text-gray-400">/</span>
        <span className="font-medium text-gray-900">Individual Evaluation</span>
      </div>

      {/* Evaluation Header Card */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {evaluation.isAIReport ? (
                  <Bot className="w-6 h-6 text-blue-600" />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {evaluation.evaluator ||
                      (evaluation.isAIReport
                        ? "AI Evaluation"
                        : "Council Evaluation")}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {stageName}
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={getStatusColor(evaluation.status)}
              >
                {evaluation.status}
              </Badge>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {evaluation.totalRate}/10
                </p>
                <p className="text-sm text-gray-500">Score</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Submitted: {formatDate(evaluation.submittedAt)}</span>
            </div>
            {evaluation.documentId && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Document attached</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  evaluation.isApproved ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span>
                {evaluation.isApproved ? "Approved" : "Pending Approval"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EvaluationOverviewTab evaluation={evaluation} />
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <EvaluationDocumentTab
            evaluationId={evaluation.id}
            documentId={evaluation.documentId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndividualEvaluationDetail;
