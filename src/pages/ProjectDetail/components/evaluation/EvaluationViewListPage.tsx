import React from "react";
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
import { FileText, Calendar, Users, Eye, ArrowLeft } from "lucide-react";
import { Evaluation } from "@/types/evaluation-api";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface EvaluationViewListPageProps {
  evaluations?: Evaluation[];
}

const EvaluationViewListPage: React.FC<EvaluationViewListPageProps> = ({
  evaluations = [],
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();

  const handleEvaluationClick = (evaluationId: string) => {
    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }
    navigate(
      `${routePrefix}/project/${projectId}/evaluation/${evaluationId}/view`
    );
  };

  const handleBackToProject = () => {
    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }
    navigate(`${routePrefix}/project/${projectId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "created":
        return <Badge className="bg-blue-100 text-blue-800">Created</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        {/* Back Button - Standalone */}
        <div className="flex items-center">
          <Button
            onClick={handleBackToProject}
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Project
          </Button>
        </div>

        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-white/20">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Project Evaluations
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  View all evaluations for this project
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Evaluations
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {evaluations.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Total Stages
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {evaluations.reduce(
                      (total, evaluation) =>
                        total + evaluation["evaluation-stages"].length,
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-600">
                    Individual Evaluations
                  </p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {evaluations.reduce(
                      (total, evaluation) =>
                        total +
                        evaluation["evaluation-stages"].reduce(
                          (stageTotal, stage) =>
                            stageTotal +
                            (stage["individual-evaluations"]?.length || 0),
                          0
                        ),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluations List */}
        <div className="space-y-6">
          {evaluations.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      No evaluations available
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      This project doesn't have any evaluations yet
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                All Evaluations ({evaluations.length})
              </h3>
              <div className="grid gap-4">
                {evaluations
                  .sort(
                    (a, b) =>
                      new Date(b["create-date"]).getTime() -
                      new Date(a["create-date"]).getTime()
                  )
                  .map((evaluation, index) => (
                    <Card
                      key={evaluation.id}
                      className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
                      onClick={() => handleEvaluationClick(evaluation.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {evaluation.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {evaluation.code} •{" "}
                              {evaluation["evaluation-stages"].length} stages •
                              Created:{" "}
                              {new Date(
                                evaluation["create-date"]
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(evaluation.status)}
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-600 border-blue-200"
                          >
                            View Only
                          </Badge>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-emerald-100 rounded-full">
                            <Eye className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationViewListPage;
