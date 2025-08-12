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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Evaluations
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    {evaluations.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Total Stages
                  </p>
                  <p className="text-xl font-bold text-green-900">
                    {evaluations.reduce(
                      (total, evaluation) =>
                        total + evaluation["evaluation-stages"].length,
                      0
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-600">Created</p>
                  <p className="text-xl font-bold text-yellow-900">
                    {
                      evaluations.filter(
                        (evaluation) => evaluation.status === "created"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* All Project Evaluations */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Project Evaluations Overview
              </h4>
              <div className="space-y-3">
                {evaluations
                  .sort(
                    (a, b) =>
                      new Date(b["create-date"]).getTime() -
                      new Date(a["create-date"]).getTime()
                  )
                  .map((evaluation, index) => (
                    <div
                      key={evaluation.id}
                      className="group cursor-pointer flex items-center justify-between border border-gray-200 rounded-lg bg-white px-4 py-3 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200"
                      onClick={() => handleEvaluationClick(evaluation.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700">
                            {evaluation.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {evaluation.code} •{" "}
                            {evaluation["evaluation-stages"].length} stages •
                            Click to view details
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(evaluation.status)}
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                      </div>
                    </div>
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
