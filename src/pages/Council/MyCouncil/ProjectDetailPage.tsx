import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Users,
  Briefcase,
  Target,
  Plus,
  Eye,
  Edit,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { useProject } from "@/hooks/queries/project";
import { useGetEvaluationsByProjectId, useUpdateEvaluation, useEvaluationChairman } from "@/hooks/queries/evaluation";
import { useMilestonesByProjectId } from "@/hooks/queries/milestone";

import { Evaluation, EvaluationStageApi } from "@/types/evaluation";
import CreateEvaluationStageModal from "./CreateEvaluationStageModal";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Debug log
  console.log("🔍 ProjectDetailPage rendered with projectId:", projectId);

  // Helper function to get initial project data from sessionStorage
  const getInitialProjectData = () => {
    if (projectId) {
      const projectDataKey = `project_${projectId}`;
      const storedProjectData = sessionStorage.getItem(projectDataKey);
      
      if (storedProjectData) {
        try {
          const parsedData = JSON.parse(storedProjectData);
          console.log("🚀 Found project data in sessionStorage on initialization:", parsedData);
          return parsedData;
        } catch (parseError) {
          console.error("❌ Error parsing stored project data on initialization:", parseError);
        }
      } else {
        console.log("ℹ️ No project data found in sessionStorage for key:", projectDataKey);
      }
    }
    return null;
  };

  // State management - initialize with sessionStorage data if available
  const [projectData, setProjectData] = useState<any>(getInitialProjectData());
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [currentCouncilId, setCurrentCouncilId] = useState<string | null>(null);
  const [isEditEvaluationModalOpen, setIsEditEvaluationModalOpen] =
    useState(false);
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<Evaluation | null>(null);
  const [editFormData, setEditFormData] = useState({
    "total-rate": "" as string | number,
    comment: "",
    status: "",
  });

  // Query hooks - only use them as fallback if sessionStorage data is not available
  const { data: projectQueryData } = useProject(projectId || "");
  const { data: evaluationsData, isLoading: isLoadingEvaluations } = useGetEvaluationsByProjectId(projectId || "");
  const { data: milestonesData, isLoading: isLoadingMilestones } =
    useMilestonesByProjectId(projectId || "");

  // Extract evaluations and stages from both sessionStorage and query data
  const evaluationsFromStorage = projectData?.evaluations || [];
  const evaluationsFromAPI = evaluationsData?.["data-list"] || [];
  
  // Prioritize evaluations from sessionStorage if available, otherwise use API data
  const evaluations: Evaluation[] = evaluationsFromStorage.length > 0 ? evaluationsFromStorage : evaluationsFromAPI;
  
  const stages: EvaluationStageApi[] = evaluations.length > 0 && evaluations[0]["evaluation-stages"] 
    ? evaluations[0]["evaluation-stages"] 
    : [];
  const currentEvaluationId = evaluations.length > 0 ? evaluations[0].id : null;  // Use custom hook for chairman check
  const currentEvaluation = evaluations.length > 0 ? evaluations[0] : null;
  const { isChairman } = useEvaluationChairman(currentEvaluation);

  // Use custom hook for updating evaluation
  const updateEvaluationMutation = useUpdateEvaluation();

  // Set current council ID from session storage
  useEffect(() => {
    const storedCouncil = sessionStorage.getItem("current_council");
    if (storedCouncil) {
      try {
        const parsedCouncil = JSON.parse(storedCouncil);
        setCurrentCouncilId(parsedCouncil.id);
      } catch (parseError) {
        console.error("Error parsing stored council:", parseError);
      }
    }
  }, []);

  // Initialize project data immediately on mount if available in sessionStorage
  useEffect(() => {
    if (projectId && !projectData) {
      const projectDataKey = `project_${projectId}`;
      const storedProjectData = sessionStorage.getItem(projectDataKey);
      
      if (storedProjectData) {
        try {
          const parsedProjectData = JSON.parse(storedProjectData);
          console.log("Loading project data from sessionStorage:", parsedProjectData);
          setProjectData(parsedProjectData);
        } catch (parseError) {
          console.error("Error parsing stored project data:", parseError);
        }
      }
    }
  }, [projectId, projectData]); // Include dependencies

  // Load project data from sessionStorage first, then from API as fallback
  useEffect(() => {
    // Only check API data if we don't have sessionStorage data
    if (projectId && !projectData && projectQueryData?.data?.["project-detail"]) {
      console.log("Using project data from API:", projectQueryData.data["project-detail"]);
      setProjectData(projectQueryData.data["project-detail"]);
    }
  }, [projectId, projectQueryData, projectData]);

  // Check if stage belongs to current user's council
  const isStageOwnedByCurrentCouncil = (stage: EvaluationStageApi) => {
    if (!currentCouncilId) return true; // Default to true if no council ID available
    return stage["appraisal-council-id"] === currentCouncilId;
  };

  const handleStageClick = (stageId: string, stage?: EvaluationStageApi) => {
    if (currentEvaluationId) {
      const url = `/council/evaluation-stages/${currentEvaluationId}/${stageId}`;

      // Pass read-only flag if stage is not owned by current council
      if (stage && !isStageOwnedByCurrentCouncil(stage)) {
        navigate(`${url}?readonly=true`);
      } else {
        navigate(url);
      }
    }
  };

  const handleCreateStage = () => {
    setIsCreateStageModalOpen(true);
  };

  const handleStageCreated = () => {
    // Reload evaluation data to get updated stages
    if (currentEvaluationId) {
      // Re-run the useEffect logic
      window.location.reload();
    }
  };

  const handleEditEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setEditFormData({
      "total-rate": evaluation["total-rate"]
        ? evaluation["total-rate"].toString()
        : "",
      comment: evaluation.comment || "",
      status: evaluation.status,
    });
    setIsEditEvaluationModalOpen(true);
  };

  const handleSaveEvaluation = async () => {
    if (!selectedEvaluation) return;

    // Validation
    if (!editFormData.status) {
      // You might want to add toast back for validation
      console.error("Please select a status for the evaluation.");
      return;
    }

    const totalRateNum = parseFloat(editFormData["total-rate"] as string);
    if (isNaN(totalRateNum) || totalRateNum < 0 || totalRateNum > 100) {
      console.error("Total rate must be a valid number between 0 and 100.");
      return;
    }

    try {
      await updateEvaluationMutation.mutateAsync({
        id: selectedEvaluation.id,
        code: selectedEvaluation.code,
        title: selectedEvaluation.title,
        "total-rate": totalRateNum,
        comment: editFormData.comment,
        status: editFormData.status,
        "project-id": selectedEvaluation["project-id"],
        "appraisal-council-id": selectedEvaluation["appraisal-council-id"],
      });

      setIsEditEvaluationModalOpen(false);
      // Refresh to get updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating evaluation:", error);
    }
  };  // Add loading state check like in EvaluationDetailPage
  // Don't show loading if we have data from sessionStorage, even if API is still loading
  const isActuallyLoading = isLoadingEvaluations && !projectData;
  console.log("🔄 Loading states:", { isLoadingEvaluations, hasProjectData: !!projectData, isActuallyLoading });
  
  if (isActuallyLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  const handleBackToMyCouncil = () => {
    navigate("/council/my-council");
  };

  const getStatusBadgeVariant = (status: string) => {
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

      {/* Council and Evaluation Information Section */}

      {/* Project Information */}

      {projectData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 mb-8 overflow-hidden">
          {/* Content */}
          <div className="p-8 bg-white">
            <div className="flex items-center gap-3 mb-4">
              {/* <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 border-slate-300"
              >
                {projectData.code}
              </Badge> */}
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

      {/* Evaluations with Stages */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-montserrat">
                Project Evaluations
              </h2>
              <p className="text-slate-600 mt-2 font-open-sans">
                Main evaluation of this project
              </p>
            </div>
            {/* Remove the button for now */}
            {/* {isChairman && evaluations.length > 0 && (
              <Button
                onClick={handleCreateStage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Stage
              </Button>
            )} */}
          </div>
        </div>
        {isLoadingEvaluations ? (
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
              <div key={evaluation.id} className="space-y-4">
                {/* Main Evaluation Card */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-green-50 border border-slate-200/50">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-montserrat">
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
                    {isChairman && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEvaluation(evaluation)}
                        className="hover:bg-green-50 hover:border-green-200 h-8 px-3"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Evaluation
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stages under this evaluation */}
                {stages.length > 0 && (
                  <div className="ml-8 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-purple-200 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-purple-700">
                        Evaluation Stages ({stages.length})
                      </h4>
                    </div>
                    {stages
                      .sort((a, b) => a["stage-order"] - b["stage-order"])
                      .map((stage) => (
                        <div
                          key={stage.id}
                          className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer border ${
                            isStageOwnedByCurrentCouncil(stage)
                              ? "bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-100 border-purple-200/50 hover:border-purple-300"
                              : "bg-gradient-to-r from-gray-50 to-slate-50 hover:from-slate-50 hover:to-gray-100 border-gray-200/50 hover:border-gray-300"
                          }`}
                          onClick={() => handleStageClick(stage.id, stage)}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                                isStageOwnedByCurrentCouncil(stage)
                                  ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                                  : "bg-gradient-to-br from-gray-400 to-slate-500"
                              }`}
                            >
                              <span className="text-white font-bold text-sm">
                                {stage["stage-order"]}
                              </span>
                            </div>
                            <div>
                              <h4
                                className={`text-sm font-semibold transition-colors ${
                                  isStageOwnedByCurrentCouncil(stage)
                                    ? "text-slate-900 group-hover:text-purple-700"
                                    : "text-slate-700 group-hover:text-gray-600"
                                }`}
                              >
                                {stage.name}
                                {!isStageOwnedByCurrentCouncil(stage) && (
                                  <span className="ml-2 text-xs text-gray-500 font-normal">
                                    (Other Council)
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-600">
                                {stage.phrase} • {stage.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={getStatusBadgeVariant(stage.status)}
                              className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1"
                            >
                              {stage.status}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageClick(stage.id, stage);
                              }}
                              className={`h-8 px-3 ${
                                isStageOwnedByCurrentCouncil(stage)
                                  ? "hover:bg-purple-50 hover:border-purple-200"
                                  : "hover:bg-gray-50 hover:border-gray-200 text-gray-600"
                              }`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {isStageOwnedByCurrentCouncil(stage)
                                ? "View"
                                : "View Only"}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Empty stages state */}
                {stages.length === 0 && (
                  <div className="ml-8 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <p className="text-sm">No evaluation stages yet</p>
                      {isChairman && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCreateStage}
                          className="mt-2 h-8 px-3 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Create First Stage
                        </Button>
                      )}
                    </div>
                  </div>
                )}
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

      {/* Edit Evaluation Modal */}
      <Dialog
        open={isEditEvaluationModalOpen}
        onOpenChange={setIsEditEvaluationModalOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-green-500" />
              Edit Evaluation
            </DialogTitle>
            <DialogDescription>
              Update the evaluation details. Only chairmen can edit evaluations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="total-rate">
                Total Rate (0-100) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="total-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editFormData["total-rate"]}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    "total-rate": e.target.value,
                  }))
                }
                placeholder="Enter total rate (0-100)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={editFormData.comment}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Enter evaluation comment"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditEvaluationModalOpen(false)}
              disabled={updateEvaluationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEvaluation}
              disabled={updateEvaluationMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {updateEvaluationMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Stage Modal */}
      <CreateEvaluationStageModal
        open={isCreateStageModalOpen}
        onOpenChange={setIsCreateStageModalOpen}
        evaluationId={currentEvaluationId || ""}
        existingStages={stages}
        onStageCreated={handleStageCreated}
        loading={isLoadingEvaluations}
        projectId={projectId || undefined}
      />
    </div>
  );
};

export default ProjectDetailPage;
