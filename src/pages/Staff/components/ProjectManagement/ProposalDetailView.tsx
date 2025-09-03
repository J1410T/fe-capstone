import React, { useState, useEffect, useCallback } from "react";
// ProposalDetailView component for displaying proposal details
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  FileText,
  Users,
  Briefcase,
  Target,
  Plus,
  CheckCircle,
  Crown,
  UserCheck,
  Edit,
} from "lucide-react";
import { Loading } from "@/components/ui/loaders";
import { getEvaluationsByProjectId } from "@/services/resources/evaluation";
import {
  getEvaluationStagesByEvaluationId,
  getEvaluationById,
} from "@/services/resources/evaluation";

import { 
  useGetEvaluationsByProjectId,
  useUpdateEvaluationStage,
  useUpdateEvaluation,
} from "@/hooks/queries/evaluation";
import { useMilestonesByProjectId } from "@/hooks/queries/milestone";
import {
  useAppraisalCouncilsList,
} from "@/hooks/queries/appraisal-council";


import { getUserRolesByAppraisalCouncil } from "@/services/resources/auth";
import { updateProject } from "@/services/resources/project";

import { Evaluation, EvaluationStageApi } from "@/types/evaluation";
import { LegacyProject, Council } from "@/types/detailViewTypes";
import { Milestone } from "@/types/milestone";
import { AppraisalCouncil } from "@/types/appraisal-council";
import { UpdateProjectRequest } from "@/types/project";
import CreateEvaluationStageModal from "../../../Council/MyCouncil/CreateEvaluationStageModal";
import { CouncilAssignmentModal } from "./CouncilAssignmentModal";
import { UserRole } from "@/types/auth";

interface ProposalDetailViewProps {
  selectedProposal: LegacyProject | null;
  navigateToPage: (
    type:
      | "project"
      | "proposal"
      | "evaluation"
      | "evaluation-stage"
      | "milestone"
      | "council"
      | "document"
      | "request"
      | "pi-request",
    data?: unknown
  ) => void;
  onAssignCouncil: (project: LegacyProject, council: Council) => void;
}

const ProposalDetailView: React.FC<ProposalDetailViewProps> = ({
  selectedProposal,
  navigateToPage,
}) => {
  // State management
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [stages, setStages] = useState<EvaluationStageApi[]>([]);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(true);
  const [currentEvaluationId, setCurrentEvaluationId] = useState<string | null>(
    null
  );
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false);
  const [selectedStageForCouncil, setSelectedStageForCouncil] =
    useState<EvaluationStageApi | null>(null);
  const [selectedEvaluationForCouncil, setSelectedEvaluationForCouncil] =
    useState<Evaluation | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stageCouncils, setStageCouncils] = useState<Record<string, Council>>(
    {}
  );
  const [evaluationCouncils, setEvaluationCouncils] = useState<
    Record<string, Council>
  >({});
  const [isAssigningCouncil, setIsAssigningCouncil] = useState(false);
  const [stageCouncilMembers, setStageCouncilMembers] = useState<
    Record<string, UserRole[]>
  >({});
  const [evaluationCouncilMembers, setEvaluationCouncilMembers] = useState<
    Record<string, UserRole[]>
  >({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    "english-title": "",
    "vietnamese-title": "",
    description: "",
    type: "",
    genre: "",
    category: "",
    "maximum-member": 0,
    language: "",
    status: "",
  });

  // Query hooks
  const { data: evaluationsQueryData, isLoading: isLoadingEvaluationsQuery } =
    useGetEvaluationsByProjectId(selectedProposal?.id || "");
  const { data: milestonesData, isLoading: isLoadingMilestones } =
    useMilestonesByProjectId(selectedProposal?.id || "");

  // Appraisal Council hooks
  const { data: councilsList } = useAppraisalCouncilsList({
    "key-word": "",
    "page-index": 1,
    "page-size": 100,
    status: "created",
  });

  const updateEvaluationStageMutation = useUpdateEvaluationStage();
  const updateEvaluationMutation = useUpdateEvaluation();

  // Function to convert AppraisalCouncil to Council
  const convertToCouncil = (appraisalCouncil: AppraisalCouncil): Council => ({
    id: appraisalCouncil.id,
    name: appraisalCouncil.name,
    description: `Code: ${appraisalCouncil.code}`,
    chairperson: "TBD", // This would need to be fetched from members
    members: (appraisalCouncil.member || []).map((member) => ({
      id: member.id,
      name: member["full-name"],
      role: member.name,
      department: "TBD", // Not available in UserRole
      expertise: [], // Not available in UserRole
    })),
    specialization: [], // This would need to be fetched separately
    status: appraisalCouncil.status === "created" ? "active" : "inactive",
    createdAt: appraisalCouncil["created-at"],
    maxProjects: 10, // Default value
    currentProjects: 0, // Default value
  });

  // Function to load council members for a specific council
  const loadCouncilMembers = async (councilId: string) => {
    try {
      const membersResponse = await getUserRolesByAppraisalCouncil(
        councilId,
        1,
        100
      );
      return membersResponse["data-list"] || [];
    } catch (error) {
      console.error(`Error loading members for council ${councilId}:`, error);
      return [];
    }
  };

  // Function to load council information for stages using hooks data
  const loadStageCouncils = useCallback(
    async (stages: EvaluationStageApi[]) => {
      const councils: Record<string, Council> = {};
      const members: Record<string, UserRole[]> = {};

      // Get unique council IDs
      const councilIds = [
        ...new Set(
          stages
            .filter((stage) => stage["appraisal-council-id"])
            .map((stage) => stage["appraisal-council-id"])
        ),
      ];

      if (councilIds.length === 0) {
        setStageCouncils(councils);
        return;
      }

      try {
        // Use councils data from hook instead of API call
        if (councilsList?.["data-list"]) {
          // Map councils by ID
          const councilsMap = councilsList["data-list"].reduce(
            (acc, council) => {
              acc[council.id] = council;
              return acc;
            },
            {} as Record<string, AppraisalCouncil>
          );

          // Assign councils to stages and load members
          for (const stage of stages) {
            if (
              stage["appraisal-council-id"] &&
              councilsMap[stage["appraisal-council-id"]]
            ) {
              const council = councilsMap[stage["appraisal-council-id"]];
              councils[stage.id] = convertToCouncil(council);

              // Load members for this council using manual call for now
              // TODO: This could be optimized to use individual hooks for each council
              const councilMembers = await loadCouncilMembers(council.id);
              members[stage.id] = councilMembers;
            }
          }
        }

        setStageCouncils(councils);
        setStageCouncilMembers(members);
      } catch (error) {
        console.error("Error loading councils:", error);
        setStageCouncils(councils);
      }
    },
    [councilsList]
  );

  // Function to load council information for evaluations using hooks data
  const loadEvaluationCouncils = useCallback(
    async (evaluations: Evaluation[]) => {
      const councils: Record<string, Council> = {};
      const members: Record<string, UserRole[]> = {};

      // Get unique council IDs
      const councilIds = [
        ...new Set(
          evaluations
            .filter((evaluation) => evaluation["appraisal-council-id"])
            .map((evaluation) => evaluation["appraisal-council-id"])
        ),
      ];

      if (councilIds.length === 0) {
        setEvaluationCouncils(councils);
        return;
      }

      try {
        // Use councils data from hook instead of API call
        if (councilsList?.["data-list"]) {
          // Map councils by ID
          const councilsMap = councilsList["data-list"].reduce(
            (acc, council) => {
              acc[council.id] = council;
              return acc;
            },
            {} as Record<string, AppraisalCouncil>
          );

          // Assign councils to evaluations and load members
          for (const evaluation of evaluations) {
            if (
              evaluation["appraisal-council-id"] &&
              councilsMap[evaluation["appraisal-council-id"]]
            ) {
              const council = councilsMap[evaluation["appraisal-council-id"]];
              councils[evaluation.id] = convertToCouncil(council);

              // Load members for this council using manual call for now
              // TODO: This could be optimized to use individual hooks for each council
              const councilMembers = await loadCouncilMembers(council.id);
              members[evaluation.id] = councilMembers;
            }
          }
        }

        setEvaluationCouncils(councils);
        setEvaluationCouncilMembers(members);
      } catch (error) {
        console.error("Error loading evaluation councils:", error);
        setEvaluationCouncils(councils);
      }
    },
    [councilsList]
  );

  // Load evaluations and stages for this proposal
  useEffect(() => {
    const loadEvaluationsAndStages = async () => {
      if (!selectedProposal?.id) return;

      try {
        setIsLoadingEvaluations(true);

        // First priority: Try to get evaluation from stored project data
        const projectDataKey = `project_${selectedProposal.id}`;
        const storedProjectData =
          localStorage.getItem(projectDataKey) ||
          sessionStorage.getItem(projectDataKey);

        if (storedProjectData) {
          try {
            const parsedProjectData = JSON.parse(storedProjectData);

            if (
              parsedProjectData.proposals &&
              parsedProjectData.proposals[0]?.evaluations?.[0]
            ) {
              const evaluation = parsedProjectData.proposals[0].evaluations[0];
              setEvaluations([evaluation]);
              setCurrentEvaluationId(evaluation.id);

              // Load council information for evaluations
              await loadEvaluationCouncils([evaluation]);

              // Load stages for this evaluation
              try {
                const evaluationData = await getEvaluationById(
                  evaluation.id,
                  true
                );
                const stages = evaluationData["evaluation-stages"] || [];
                setStages(stages);
                // Load council information for stages
                await loadStageCouncils(stages);
              } catch {
                // Fallback: Load stages separately
                const stagesResponse = await getEvaluationStagesByEvaluationId({
                  "evaluation-id": evaluation.id,
                  "page-index": 1,
                  "page-size": 20,
                });
                const stages = stagesResponse["data-list"] || [];
                setStages(stages);
                // Load council information for stages
                await loadStageCouncils(stages);
              }

              return; // Exit early, no need for API call
            } else {
              // No evaluation found in stored project data
            }
          } catch (parseError) {
            console.error("Error parsing stored project data:", parseError);
          }
        }

        const requestBody = {
          "project-id": selectedProposal.id,
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
            (evaluation: Evaluation) =>
              evaluation["project-id"] === selectedProposal.id
          );

          if (projectEvaluations.length > 0) {
            const evaluation = projectEvaluations[0];
            setEvaluations([evaluation]);
            setCurrentEvaluationId(evaluation.id);

            // Load council information for evaluations
            await loadEvaluationCouncils([evaluation]);

            // Load stages for this evaluation
            try {
              const evaluationData = await getEvaluationById(
                evaluation.id,
                true
              );
              const stages = evaluationData["evaluation-stages"] || [];
              setStages(stages);
              // Load council information for stages
              await loadStageCouncils(stages);
            } catch {
              // Fallback: Load stages separately
              const stagesResponse = await getEvaluationStagesByEvaluationId({
                "evaluation-id": evaluation.id,
                "page-index": 1,
                "page-size": 20,
              });
              const stages = stagesResponse["data-list"] || [];
              setStages(stages);
              // Load council information for stages
              await loadStageCouncils(stages);
            }
          } else {
            setEvaluations([]);
            setStages([]);
          }
        } else {
          setEvaluations([]);
          setStages([]);
        }
      } catch (error: unknown) {
        const errorResponse = error as { response?: { status?: number } };
        if (errorResponse.response?.status === 404) {
          // Evaluation endpoint not found (404) - this proposal may not have evaluations yet
        } else if (errorResponse.response?.status === 401) {
          // Unauthorized (401) - token may be expired
        }

        // API call failed, no evaluation data available
        setEvaluations([]);
        setStages([]);
      } finally {
        setIsLoadingEvaluations(false);
      }
    };

    loadEvaluationsAndStages();
  }, [selectedProposal?.id, loadStageCouncils, loadEvaluationCouncils]);

  // Handle evaluations data from query hooks
  useEffect(() => {
    if (evaluationsQueryData?.["data-list"]) {
      const evaluationsList = evaluationsQueryData["data-list"];
      setEvaluations(evaluationsList);
      setIsLoadingEvaluations(false);

      // Load council information for evaluations
      loadEvaluationCouncils(evaluationsList);
    }
  }, [evaluationsQueryData, loadEvaluationCouncils]);

  const handleStageClick = (stageId: string) => {
    if (currentEvaluationId) {
      navigateToPage("evaluation-stage", {
        evaluationId: currentEvaluationId,
        stageId,
      });
    }
  };

  const handleCreateStage = () => {
    setIsCreateStageModalOpen(true);
  };

  const handleEditProposal = () => {
    if (selectedProposal) {
      setEditFormData({
        "english-title": selectedProposal["english-title"] || "",
        "vietnamese-title": selectedProposal["vietnamese-title"] || "",
        description: selectedProposal.description || "",
        type: selectedProposal.type || "",
        genre: selectedProposal.genre || "",
        category: selectedProposal.category || "",
        "maximum-member": selectedProposal["maximum-member"] || 0,
        language: selectedProposal.language || "",
        status: selectedProposal.status || "",
      });
    }
    setErrorMessage(""); // Clear any previous error messages
    setIsEditModalOpen(true);
  };

  const handleSaveProposal = async () => {
    if (!selectedProposal?.id) return;

    // Validation
    if (!editFormData.status) {
      setErrorMessage("Please select a status for the proposal.");
      return;
    }

    if (!editFormData["english-title"] || !editFormData["vietnamese-title"]) {
      setErrorMessage("Please fill in both English and Vietnamese titles.");
      return;
    }

    try {
      const updateData: UpdateProjectRequest = {
        "english-title": editFormData["english-title"],
        "vietnamese-title": editFormData["vietnamese-title"],
        description: editFormData.description,
        type: editFormData.type,
        genre: editFormData.genre,
        category: editFormData.category,
        "maximum-member": editFormData["maximum-member"],
        language: editFormData.language,
        status: editFormData.status,
      };

      await updateProject(selectedProposal.id, updateData);

      setIsEditModalOpen(false);
      setSuccessMessage("Proposal updated successfully!");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating proposal:", error);
      setSuccessMessage("Failed to update proposal. Please try again.");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 3000);
    }
  };

  const reloadStages = async () => {
    if (!selectedProposal?.id || !currentEvaluationId) return;

    try {
      // Load stages for current evaluation
      const evaluationData = await getEvaluationById(currentEvaluationId, true);
      const stages = evaluationData["evaluation-stages"] || [];
      setStages(stages);

      // Load council information for stages
      await loadStageCouncils(stages);
    } catch (error) {
      console.error("Error reloading stages:", error);
      // Fallback: Load stages separately
      try {
        const stagesResponse = await getEvaluationStagesByEvaluationId({
          "evaluation-id": currentEvaluationId,
          "page-index": 1,
          "page-size": 20,
        });
        const stages = stagesResponse["data-list"] || [];
        setStages(stages);
        await loadStageCouncils(stages);
      } catch (fallbackError) {
        console.error("Error in fallback stage loading:", fallbackError);
      }
    }
  };

  const handleStageCreated = async () => {
    // Show success message
    setSuccessMessage("Successfully created evaluation stage!");
    setShowSuccessMessage(true);

    // Reload stages to show the new stage
    await reloadStages();

    // Auto hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage("");
    }, 3000);
  };

  const handleAssignCouncil = async (
    stage: EvaluationStageApi,
    council: Council
  ) => {
    if (!stage || !council) {
      return;
    }

    setIsAssigningCouncil(true);

    try {
      // Use mutation hook instead of direct API call
      await updateEvaluationStageMutation.mutateAsync({
        id: stage.id,
        name: stage.name,
        "stage-order": stage["stage-order"],
        phrase: stage.phrase,
        type: stage.type,
        status: stage.status,
        "evaluation-id": stage["evaluation-id"],
        "milestone-id": stage["milestone-id"],
        "appraisal-council-id": council.id,
      });

      // Load members for the newly assigned council
      const councilMembers = await loadCouncilMembers(council.id);

      // Update stage councils and members
      setStageCouncils((prev) => ({
        ...prev,
        [stage.id]: council,
      }));
      setStageCouncilMembers((prev) => ({
        ...prev,
        [stage.id]: councilMembers,
      }));

      setSuccessMessage(
        `Successfully assigned council "${council.name}" to stage "${stage.name}"`
      );
      setShowSuccessMessage(true);

      // Close council modal
      setIsCouncilModalOpen(false);
      setSelectedStageForCouncil(null);

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error assigning council to stage:", error);

      // Show error message to user
      setErrorMessage(
        `Failed to assign council "${council.name}" to stage "${stage.name}". Please try again.`
      );
      setShowSuccessMessage(true);
      setSuccessMessage("");

      // Auto hide error message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsAssigningCouncil(false);
    }
  };

  const handleAssignEvaluationCouncil = async (
    evaluation: Evaluation,
    council: Council
  ) => {
    if (!evaluation || !council) {
      return;
    }

    setIsAssigningCouncil(true);

    try {
      // Use mutation hook instead of direct API call
      await updateEvaluationMutation.mutateAsync({
        id: evaluation.id,
        code: evaluation.code,
        title: evaluation.title,
        "total-rate": evaluation["total-rate"],
        comment: evaluation.comment,
        status: evaluation.status,
        "project-id": evaluation["project-id"],
        "appraisal-council-id": council.id,
      });

      // Load members for the newly assigned council
      const councilMembers = await loadCouncilMembers(council.id);

      // Update evaluation councils and members
      setEvaluationCouncils((prev) => ({
        ...prev,
        [evaluation.id]: council,
      }));
      setEvaluationCouncilMembers((prev) => ({
        ...prev,
        [evaluation.id]: councilMembers,
      }));

      setSuccessMessage(
        `Successfully assigned council "${council.name}" to evaluation "${evaluation.title}"`
      );
      setShowSuccessMessage(true);

      // Close council modal
      setIsCouncilModalOpen(false);
      setSelectedEvaluationForCouncil(null);

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error assigning council to evaluation:", error);

      // Show error message to user
      setErrorMessage(
        `Failed to assign council "${council.name}" to evaluation "${evaluation.title}". Please try again.`
      );
      setShowSuccessMessage(true);
      setSuccessMessage("");

      // Auto hide error message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsAssigningCouncil(false);
    }
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

  // Add loading state check
  if (isLoadingEvaluations) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (!selectedProposal) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No proposal selected</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedProposal["english-title"]}
          </h1>
          <p className="text-gray-600 mt-1">
            {selectedProposal["vietnamese-title"]}
          </p>
        </div>
        <Button
          onClick={handleEditProposal}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Proposal
        </Button>
      </div>

      {/* Success/Error Message */}
      {showSuccessMessage && (
        <div
          className={`${
            errorMessage
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          } border rounded-lg p-4 mb-6`}
        >
          <div className="flex items-center">
            <CheckCircle
              className={`h-5 w-5 ${
                errorMessage ? "text-red-500" : "text-green-500"
              } mr-3`}
            />
            <p
              className={`${
                errorMessage ? "text-red-800" : "text-green-800"
              } font-medium`}
            >
              {errorMessage || successMessage}
            </p>
          </div>
        </div>
      )}

      {/* Proposal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 mb-8 overflow-hidden">
        {/* Content */}
        <div className="p-8 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-700 border-slate-300"
            >
              {selectedProposal.code}
            </Badge>
            <Badge className="bg-green-100 text-green-700 border-green-300">
              {selectedProposal.status}
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
                  {new Date(selectedProposal["created-at"]).toLocaleDateString(
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
                  {selectedProposal.category === "application/implementation"
                    ? "Basic - School Level"
                    : selectedProposal.category || "Basic - School Level"}
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
                  {selectedProposal.language || "English"}
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
                  {selectedProposal.type}
                </p>
              </div>
            </div>
          </div>

          {selectedProposal.description && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-sm text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposal Description:
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProposal.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Evaluations with Stages */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-montserrat">
                Evaluation Stages
              </h2>
              <p className="text-slate-600 mt-2 font-open-sans">
                Manage evaluation stages for this proposal
              </p>
            </div>
            {evaluations.length > 0 && (
              <Button
                onClick={handleCreateStage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Stage
              </Button>
            )}
          </div>
        </div>
        {isLoadingEvaluations || isLoadingEvaluationsQuery ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : evaluations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>This proposal has no evaluations</p>
          </div>
        ) : (
          <div className="p-8">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="space-y-4">
                {/* Main Evaluation Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-green-50 border border-slate-200/50 space-y-4">
                  <div className="flex items-center justify-between">
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
                      {!evaluation["appraisal-council-id"] && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvaluationForCouncil(evaluation);
                            setSelectedStageForCouncil(null);
                            setIsCouncilModalOpen(true);
                          }}
                          className="hover:bg-blue-50 hover:border-blue-200 h-8 px-3"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          Assign Council
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Council Information for Evaluation */}
                  {evaluationCouncils[evaluation.id] && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {evaluationCouncils[evaluation.id].name}
                        </span>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Assigned
                        </Badge>
                      </div>

                      {/* Council Members */}
                      {evaluationCouncilMembers[evaluation.id] &&
                        evaluationCouncilMembers[evaluation.id].length > 0 && (
                          <div className="space-y-2">
                            {/* Chairman */}
                            {evaluationCouncilMembers[evaluation.id]
                              .filter(
                                (member: UserRole) => member.name === "Chairman"
                              )
                              .map((chairman: UserRole) => (
                                <div
                                  key={chairman.id}
                                  className="flex items-center gap-2"
                                >
                                  <Crown className="h-3 w-3 text-yellow-500" />
                                  <img
                                    src={
                                      chairman["avatar-url"] ||
                                      "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg"
                                    }
                                    alt={chairman["full-name"]}
                                    className="w-6 h-6 rounded-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";
                                    }}
                                  />
                                  <span className="text-xs font-medium text-yellow-700">
                                    {chairman["full-name"]}
                                  </span>
                                </div>
                              ))}

                            {/* Other Members */}
                            {evaluationCouncilMembers[evaluation.id]
                              .filter(
                                (member: UserRole) => member.name !== "Chairman"
                              )
                              .slice(0, 3) // Show only first 3 members to keep it compact
                              .map((member: UserRole) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-2"
                                >
                                  <Users className="h-3 w-3 text-blue-500" />
                                  <img
                                    src={
                                      member["avatar-url"] ||
                                      "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg"
                                    }
                                    alt={member["full-name"]}
                                    className="w-6 h-6 rounded-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";
                                    }}
                                  />
                                  <span className="text-xs text-blue-700">
                                    {member["full-name"]}
                                  </span>
                                </div>
                              ))}

                            {/* Show count if there are more members */}
                            {evaluationCouncilMembers[evaluation.id].filter(
                              (member: UserRole) => member.name !== "Chairman"
                            ).length > 3 && (
                              <div className="text-xs text-blue-600">
                                +
                                {evaluationCouncilMembers[evaluation.id].filter(
                                  (member: UserRole) =>
                                    member.name !== "Chairman"
                                ).length - 3}{" "}
                                more members
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </div>

                {/* Evaluation Stages */}
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
                          className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-100 transition-all duration-300 cursor-pointer border border-purple-200/50 hover:border-purple-300"
                          onClick={() => handleStageClick(stage.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {stage["stage-order"]}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                                {stage.name}
                              </h4>
                              <p className="text-xs text-slate-600">
                                {stage.phrase} • {stage.type}
                                {stage["milestone-id"] &&
                                  milestonesData?.data && (
                                    <>
                                      {" "}
                                      •{" "}
                                      {milestonesData.data.find(
                                        (m: Milestone) =>
                                          m.id === stage["milestone-id"]
                                      )?.title || "Unknown Milestone"}
                                    </>
                                  )}
                              </p>
                              {/* Council Information */}
                              {stageCouncils[stage.id] && (
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-3 w-3 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-800">
                                      {stageCouncils[stage.id].name}
                                    </span>
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                      <UserCheck className="w-3 h-3 mr-1" />
                                      Assigned
                                    </Badge>
                                  </div>

                                  {/* Council Members */}
                                  {stageCouncilMembers[stage.id] &&
                                    stageCouncilMembers[stage.id].length >
                                      0 && (
                                      <div className="space-y-2">
                                        {/* Chairman */}
                                        {stageCouncilMembers[stage.id]
                                          .filter(
                                            (member: UserRole) =>
                                              member.name === "Chairman"
                                          )
                                          .map((chairman: UserRole) => (
                                            <div
                                              key={chairman.id}
                                              className="flex items-center gap-2"
                                            >
                                              <Crown className="h-3 w-3 text-yellow-500" />
                                              <img
                                                src={
                                                  chairman["avatar-url"] ||
                                                  "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg"
                                                }
                                                alt={chairman["full-name"]}
                                                className="w-6 h-6 rounded-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.src =
                                                    "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";
                                                }}
                                              />
                                              <span className="text-xs font-medium text-yellow-700">
                                                {chairman["full-name"]}
                                              </span>
                                            </div>
                                          ))}

                                        {/* Other Members */}
                                        {stageCouncilMembers[stage.id]
                                          .filter(
                                            (member: UserRole) =>
                                              member.name !== "Chairman"
                                          )
                                          .slice(0, 2) // Show only first 2 members to keep it compact
                                          .map((member: UserRole) => (
                                            <div
                                              key={member.id}
                                              className="flex items-center gap-2"
                                            >
                                              <Users className="h-3 w-3 text-blue-500" />
                                              <img
                                                src={
                                                  member["avatar-url"] ||
                                                  "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg"
                                                }
                                                alt={member["full-name"]}
                                                className="w-6 h-6 rounded-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.src =
                                                    "https://www.advancedsciencenews.com/wp-content/uploads/2025/07/physics-Gerd-Altmann-Pixabay.jpg";
                                                }}
                                              />
                                              <span className="text-xs text-blue-700">
                                                {member["full-name"]}
                                              </span>
                                            </div>
                                          ))}

                                        {/* Show count if there are more members */}
                                        {stageCouncilMembers[stage.id].filter(
                                          (member: UserRole) =>
                                            member.name !== "Chairman"
                                        ).length > 2 && (
                                          <div className="text-xs text-blue-600">
                                            +
                                            {stageCouncilMembers[
                                              stage.id
                                            ].filter(
                                              (member: UserRole) =>
                                                member.name !== "Chairman"
                                            ).length - 2}{" "}
                                            more members
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={getStatusBadgeVariant(stage.status)}
                              className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1"
                            >
                              {stage.status}
                            </Badge>
                            {!stage["appraisal-council-id"] && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStageForCouncil(stage);
                                  setIsCouncilModalOpen(true);
                                }}
                                className="hover:bg-blue-50 hover:border-blue-200 h-8 px-3"
                              >
                                <Users className="h-3 w-3 mr-1" />
                                Assign Council
                              </Button>
                            )}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateStage}
                        className="mt-2 h-8 px-3 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Create First Stage
                      </Button>
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
            Proposal milestones
          </p>
        </div>
        {isLoadingMilestones ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : milestonesData?.data && milestonesData.data.length > 0 ? (
          <div className="p-8 space-y-6">
            {milestonesData.data.map((milestone: Milestone, index: number) => (
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
            <p>This proposal has no milestones</p>
            <p className="text-sm text-gray-400 mt-1">0 milestones</p>
          </div>
        )}
      </div>

      {/* Create Stage Modal */}
      <CreateEvaluationStageModal
        open={isCreateStageModalOpen}
        onOpenChange={setIsCreateStageModalOpen}
        evaluationId={currentEvaluationId || ""}
        existingStages={stages}
        onStageCreated={handleStageCreated}
        loading={isLoadingEvaluations}
        projectId={selectedProposal?.id || undefined}
      />

      {/* Council Assignment Modal */}
      {(selectedStageForCouncil || selectedEvaluationForCouncil) && (
        <CouncilAssignmentModal
          isOpen={isCouncilModalOpen}
          onClose={() => {
            setIsCouncilModalOpen(false);
            setSelectedStageForCouncil(null);
            setSelectedEvaluationForCouncil(null);
          }}
          project={selectedProposal}
          onAssignCouncil={(_project, council) => {
            if (selectedStageForCouncil) {
              handleAssignCouncil(selectedStageForCouncil, council);
            } else if (selectedEvaluationForCouncil) {
              handleAssignEvaluationCouncil(
                selectedEvaluationForCouncil,
                council
              );
            }
          }}
          isAssigning={isAssigningCouncil}
        />
      )}

      {/* Edit Proposal Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Edit Proposal
            </DialogTitle>
            <DialogDescription>
              Update the proposal information. Changes will be saved
              immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  English Title
                </label>
                <input
                  type="text"
                  value={editFormData["english-title"]}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      "english-title": e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Vietnamese Title
                </label>
                <input
                  type="text"
                  value={editFormData["vietnamese-title"]}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      "vietnamese-title": e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <input
                  type="text"
                  value={editFormData.type}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Genre
                </label>
                <input
                  type="text"
                  value={editFormData.genre}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      genre: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Maximum Members
                </label>
                <input
                  type="number"
                  value={editFormData["maximum-member"]}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      "maximum-member": parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Language
                </label>
                <input
                  type="text"
                  value={editFormData.language}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="created">Created</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProposal}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalDetailView;
