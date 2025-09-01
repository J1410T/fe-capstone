import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  FileText,
  ChevronRight,
  Users,
  Briefcase,
  Target,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { getEvaluationsByProjectId } from "@/services/resources/evaluation";
import { useProject } from "@/hooks/queries/project";
import { useGetEvaluationsByProjectId } from "@/hooks/queries/evaluation";
import { useMilestonesByProjectId } from "@/hooks/queries/milestone";

import { Evaluation } from "@/types/evaluation";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // State management
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(true);
  const [projectData, setProjectData] = useState<any>(null);

  // Query hooks
  const { data: projectQueryData } = useProject(projectId || "");
  const { data: evaluationsQueryData, isLoading: isLoadingEvaluationsQuery } =
    useGetEvaluationsByProjectId(projectId || "");
  const { data: milestonesData, isLoading: isLoadingMilestones } =
    useMilestonesByProjectId(projectId || "");

  // Load evaluations for this project
  useEffect(() => {
    const loadEvaluations = async () => {
      if (!projectId) return;

      try {
        setIsLoadingEvaluations(true);

        // First priority: Try to get evaluation from stored project data
        const projectDataKey = `project_${projectId}`;
        const storedProjectData =
          localStorage.getItem(projectDataKey) ||
          sessionStorage.getItem(projectDataKey);

        if (storedProjectData) {
          try {
            const parsedProjectData = JSON.parse(storedProjectData);

            // Set project data for display
            setProjectData(parsedProjectData);

            if (
              parsedProjectData.proposals &&
              parsedProjectData.proposals[0]?.evaluations?.[0]
            ) {
              const evaluation = parsedProjectData.proposals[0].evaluations[0];
              setEvaluations([evaluation]);
              return; // Exit early, no need for API call
            } else {
              console.log("❌ No evaluation found in stored project data");
            }
          } catch (parseError) {
            console.error("Error parsing stored project data:", parseError);
          }
        }

        const requestBody = {
          "project-id": projectId,
          "page-index": 1,
          "page-size": 10,
        };

        const evaluationsResponse = await getEvaluationsByProjectId(
          requestBody
        );

        const evaluationsList = evaluationsResponse["data-list"] || [];

        if (evaluationsList.length > 0) {
          // Filter evaluations that actually belong to this project
          const projectEvaluations = evaluationsList.filter(
            (evaluation: any) => evaluation["project-id"] === projectId
          );

          if (projectEvaluations.length > 0) {
            setEvaluations([projectEvaluations[0]]);
          } else {
            setEvaluations([]);
          }
        } else {
          setEvaluations([]);
        }
      } catch (error: any) {
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

  // Handle project data from query hooks
  useEffect(() => {
    if (projectQueryData?.data?.["project-detail"]) {
      setProjectData(projectQueryData.data["project-detail"]);
    }
  }, [projectQueryData]);

  // Handle evaluations data from query hooks
  useEffect(() => {
    if (evaluationsQueryData?.["data-list"]) {
      setEvaluations(evaluationsQueryData["data-list"]);
      setIsLoadingEvaluations(false);
    }
  }, [evaluationsQueryData]);

  const handleEvaluationClick = (evaluation: Evaluation) => {
    navigate(`/council/evaluation-detail/${evaluation.id}`);
  };

  const handleBackToMyCouncil = () => {
    navigate("/council/my-council");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      {projectData && (
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToMyCouncil}>
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {projectData["english-title"]}
            </h1>
            <p className="text-gray-600 mt-1">
              {projectData["vietnamese-title"]}
            </p>
          </div>
        </div>
      )}

      {/* Project Information */}

      {projectData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 mb-8 overflow-hidden">
          {/* Content */}
          <div className="p-8 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 border-slate-300"
              >
                {projectData.code}
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-300">
                {projectData.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(projectData["created-at"]).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Category
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {projectData.category === "application/implementation"
                      ? "Basic - School Level"
                      : projectData.category || "Basic - School Level"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Language
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {projectData.language || "English"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Type
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {projectData.type}
                  </p>
                </div>
              </div>
            </div>

            {projectData.description && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-sm text-slate-700 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Project Description:
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {projectData.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evaluations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 font-montserrat">
            Project Evaluations
          </h2>
          <p className="text-slate-600 mt-2 font-open-sans">
            Main evaluation of this project
          </p>
        </div>
        {isLoadingEvaluations || isLoadingEvaluationsQuery ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : evaluations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>This project has no evaluations</p>
          </div>
        ) : (
          <div className="p-8">
            {evaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-green-50 hover:from-green-50 hover:to-emerald-100 transition-all duration-300 cursor-pointer border border-slate-200/50 hover:border-green-200"
                onClick={() => handleEvaluationClick(evaluation)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-montserrat group-hover:text-green-700 transition-colors">
                      {evaluation.title}
                    </h3>
                    <p className="text-slate-600 font-open-sans">
                      {evaluation.code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
                  >
                    {evaluation.status}
                  </Badge>
                  <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-green-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 h-fit">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 font-montserrat">
            Milestones
          </h2>
          <p className="text-slate-600 mt-2 font-open-sans">
            Project milestones
          </p>
        </div>
        {isLoadingMilestones ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : milestonesData?.data && milestonesData.data.length > 0 ? (
          <div className="p-8 space-y-6">
            {milestonesData.data.map((milestone: any, index: number) => (
              <div
                key={milestone.id || index}
                className="p-6 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <h3 className="font-bold text-slate-900 font-montserrat">
                      {milestone.title}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs bg-slate-50">
                    {milestone.status}
                  </Badge>
                </div>
                <div className="ml-7">
                  <div className="text-sm font-medium text-indigo-600 mb-2">
                    {milestone["start-date"] && milestone["end-date"] ? (
                      <>
                        <div className="font-mono">
                          {new Date(milestone["start-date"]).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                            }
                          )}
                          {" → "}
                          {new Date(milestone["end-date"]).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                            }
                          )}
                        </div>
                      </>
                    ) : milestone["created-at"] ? (
                      <>
                        <div className="font-mono">
                          {new Date(milestone["created-at"]).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-700 whitespace-pre-line font-open-sans">
                    {milestone.description}
                  </div>
                  {milestone.objective && (
                    <div className="mt-2 text-xs">
                      <span className="text-blue-600 font-medium">
                        Objective:{" "}
                      </span>
                      <span className="text-gray-600">
                        {milestone.objective}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>This project has no milestones</p>
            <p className="text-sm text-gray-400 mt-1">0 milestones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
