import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Star,
  ChevronRight,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { getEvaluationsByProjectId } from "@/services/resources/evaluation";

import { Evaluation } from "@/types/evaluation";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // State management
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(true);

  // Load evaluations for this project
  useEffect(() => {
    const loadEvaluations = async () => {
      if (!projectId) return;

      try {
        setIsLoadingEvaluations(true);
        console.log("=== DEBUG: Loading evaluations for project ===");
        console.log("Project ID:", projectId);

        // First priority: Try to get evaluation from stored project data
        const projectDataKey = `project_${projectId}`;
        const storedProjectData =
          localStorage.getItem(projectDataKey) ||
          sessionStorage.getItem(projectDataKey);

        if (storedProjectData) {
          try {
            const projectData = JSON.parse(storedProjectData);
            console.log("✅ Found stored project data:", projectData);

            if (
              projectData.proposals &&
              projectData.proposals[0]?.evaluations?.[0]
            ) {
              const evaluation = projectData.proposals[0].evaluations[0];
              console.log(
                "✅ Using evaluation from stored project data:",
                evaluation
              );
              console.log(
                "Evaluation belongs to project:",
                evaluation["project-id"]
              );
              setEvaluations([evaluation]);
              return; // Exit early, no need for API call
            } else {
              console.log("❌ No evaluation found in stored project data");
            }
          } catch (parseError) {
            console.error("Error parsing stored project data:", parseError);
          }
        }

        // Second priority: Try API call if no stored data
        console.log("No stored data, trying API call...");

        const requestBody = {
          "project-id": projectId,
          "page-index": 1,
          "page-size": 10,
        };
        console.log("API Request body:", requestBody);

        const evaluationsResponse = await getEvaluationsByProjectId(
          requestBody
        );
        console.log("=== DEBUG: API Response ===");
        console.log("Full response:", evaluationsResponse);

        const evaluationsList = evaluationsResponse["data-list"] || [];

        if (evaluationsList.length > 0) {
          // Filter evaluations that actually belong to this project
          const projectEvaluations = evaluationsList.filter(
            (evaluation: any) => evaluation["project-id"] === projectId
          );

          console.log("All evaluations from API:", evaluationsList);
          console.log("Filtered evaluations for project:", projectEvaluations);

          if (projectEvaluations.length > 0) {
            console.log("✅ Found matching evaluation:", projectEvaluations[0]);
            setEvaluations([projectEvaluations[0]]);
          } else {
            console.log("❌ No evaluations match this project ID");
            setEvaluations([]);
          }
        } else {
          console.log("❌ No evaluations found in API response");
          setEvaluations([]);
        }
      } catch (error: any) {
        console.error("Error loading evaluations:", error);
        console.error("Failed to load evaluations for project:", projectId);

        if (error.response?.status === 404) {
          console.log(
            "Evaluation endpoint not found (404) - this project may not have evaluations yet"
          );
        } else if (error.response?.status === 401) {
          console.log("Unauthorized (401) - token may be expired");
        }

        console.log("❌ API call failed, no evaluation data available");
        setEvaluations([]);
      } finally {
        setIsLoadingEvaluations(false);
      }
    };

    loadEvaluations();
  }, [projectId]);

  const getStatusBadgeVariant = (status: string | undefined) => {
    if (!status) return "secondary";

    switch (status.toLowerCase()) {
      case "created":
        return "secondary";
      case "submitted":
        return "default";
      case "approved":
        return "default";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleEvaluationClick = (evaluation: Evaluation) => {
    navigate(`/council/evaluation-detail/${evaluation.id}`);
  };

  const handleBackToMyCouncil = () => {
    navigate("/council/my-council");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBackToMyCouncil}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Council
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Project Evaluation
          </h1>
        </div>
      </div>

      {/* Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Evaluation {evaluations.length > 0 ? `(1)` : `(0)`}
          </CardTitle>
          <CardDescription>Main evaluation of this project</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEvaluations ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : evaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Dự án này chưa có đánh giá</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {evaluations.map((evaluation) => (
                <Card
                  key={evaluation.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleEvaluationClick(evaluation)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{evaluation.code}</h3>
                          <Badge
                            variant={getStatusBadgeVariant(evaluation.status)}
                          >
                            {evaluation.status}
                          </Badge>
                        </div>

                        <p className="text-gray-600">{evaluation.title}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(
                              evaluation["create-date"]
                            ).toLocaleDateString("vi-VN")}
                          </span>
                          {evaluation["total-rate"] && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {evaluation["total-rate"]}/10
                            </span>
                          )}
                          {evaluation["evaluation-stages"] && (
                            <span>
                              Stages: {evaluation["evaluation-stages"].length}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
