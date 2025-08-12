import React from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Calendar, Users, ArrowRight } from "lucide-react";
import { Evaluation } from "@/types/evaluation-api";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface EvaluationBoardTabProps {
  evaluations: Evaluation[];
}

const EvaluationBoardTab: React.FC<EvaluationBoardTabProps> = ({
  evaluations,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();

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

  const handleEvaluationClick = (evaluationId: string) => {
    console.log(
      "Navigating to evaluation:",
      evaluationId,
      "Project:",
      projectId,
      "User role:",
      user?.role
    );

    // Determine the correct route prefix based on user role
    let routePrefix = "";
    if (user?.role === UserRole.RESEARCHER) {
      routePrefix = "/researcher";
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      routePrefix = "/pi";
    }

    const targetRoute = `${routePrefix}/project/${projectId}/evaluation/${evaluationId}/view`;
    console.log("Navigating to route:", targetRoute);
    navigate(targetRoute);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Evaluation Board
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              View evaluation progress and results across all stages (View-only)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {evaluations.length === 0 ? (
          <div className="text-center py-12">
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
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Total Evaluations
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {evaluations.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700">
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

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-600 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-700">
                        Individual Reviews
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

            {/* All Project Evaluations */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-700" />
                Project Evaluations Overview
              </h4>
              <div className="space-y-4">
                {evaluations
                  .sort(
                    (a, b) =>
                      new Date(b["create-date"]).getTime() -
                      new Date(a["create-date"]).getTime()
                  )
                  .map((evaluation, index) => (
                    <Card
                      key={evaluation.id}
                      className="group cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                      onClick={() => handleEvaluationClick(evaluation.id)}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4 hover:bg-blue-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 mb-1">
                                {evaluation.title}
                              </h5>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {evaluation.code}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {evaluation["evaluation-stages"].length}{" "}
                                  stages
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(
                                    evaluation["create-date"]
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(evaluation.status)}
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EvaluationBoardTab;
