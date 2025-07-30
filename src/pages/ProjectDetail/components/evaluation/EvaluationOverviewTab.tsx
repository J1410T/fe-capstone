import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Bot,
  Calendar,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { IndividualEvaluation } from "@/types/task";

interface EvaluationOverviewTabProps {
  evaluation: IndividualEvaluation;
}

// Mock detailed evaluation criteria - in real app this would come from API
const mockEvaluationCriteria = [
  {
    id: "1",
    name: "Scientific Merit",
    description: "Quality and innovation of the research approach",
    score: 9,
    maxScore: 10,
    comment: "Excellent scientific approach with novel methodology",
  },
  {
    id: "2",
    name: "Methodology",
    description: "Appropriateness and rigor of research methods",
    score: 8,
    maxScore: 10,
    comment: "Well-structured methodology with minor improvements needed",
  },
  {
    id: "3",
    name: "Feasibility",
    description: "Likelihood of successful completion within constraints",
    score: 8,
    maxScore: 10,
    comment: "Realistic timeline and resource allocation",
  },
  {
    id: "4",
    name: "Impact",
    description: "Potential scientific and societal impact",
    score: 9,
    maxScore: 10,
    comment: "High potential for significant impact in the field",
  },
  {
    id: "5",
    name: "Team Capability",
    description: "Team's expertise and ability to execute the project",
    score: 8,
    maxScore: 10,
    comment: "Strong team with relevant expertise",
  },
];

export const EvaluationOverviewTab: React.FC<EvaluationOverviewTabProps> = ({
  evaluation,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Evaluator Information */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {evaluation.isAIReport ? (
              <Bot className="w-5 h-5 text-blue-600" />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
            Evaluator Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900 mt-1">
                {evaluation.evaluator || 
                 (evaluation.isAIReport ? "AI Evaluation System" : "Anonymous Council Member")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <div className="mt-1">
                <Badge variant="outline" className={
                  evaluation.isAIReport 
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                }>
                  {evaluation.isAIReport ? "AI Evaluation" : "Human Evaluation"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Submitted Date</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-gray-900">{formatDate(evaluation.submittedAt)}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center gap-2 mt-1">
                {evaluation.status === "submitted" ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : evaluation.status === "in_progress" ? (
                  <Clock className="w-4 h-4 text-blue-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <p className="text-gray-900 capitalize">{evaluation.status.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">{evaluation.totalRate}</p>
              <p className="text-sm text-gray-500">out of 10</p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${getScoreColor(evaluation.totalRate, 10)}`}>
                {((evaluation.totalRate / 10) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500">Performance</p>
            </div>
          </div>
          <Progress 
            value={(evaluation.totalRate / 10) * 100} 
            className="h-3"
          />
        </CardContent>
      </Card>

      {/* Detailed Criteria Scores */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Evaluation Criteria
          </CardTitle>
          <CardDescription>
            Detailed breakdown of scores across different evaluation criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockEvaluationCriteria.map((criteria) => (
            <div key={criteria.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                  <p className="text-sm text-gray-600">{criteria.description}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getScoreColor(criteria.score, criteria.maxScore)}`}>
                    {criteria.score}/{criteria.maxScore}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(criteria.score, criteria.maxScore)}`}
                  style={{ width: `${(criteria.score / criteria.maxScore) * 100}%` }}
                />
              </div>
              {criteria.comment && (
                <p className="text-sm text-gray-700 italic bg-gray-50 p-2 rounded">
                  "{criteria.comment}"
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            Overall Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 leading-relaxed">
              {evaluation.comment || "No additional comments provided."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Approval Status */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Approval Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {evaluation.isApproved ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Approved</p>
                  <p className="text-sm text-green-600">
                    This evaluation has been approved and is final.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Clock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Pending Approval</p>
                  <p className="text-sm text-yellow-600">
                    This evaluation is awaiting final approval.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationOverviewTab;
