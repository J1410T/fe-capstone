import {
  createFirstEvaluation,
  createIndividualEvaluation,
  getEvaluationsByProjectId,
  getEvaluationStagesByEvaluationId,
  getEvaluationStagesById,
  getIndividualEvaluationById,
  getIndividualEvaluationsByStageId,
  updateEvaluationStage,
  updateIndividualEvaluation,
} from "@/services/resources/evaluation";
import {
  CreateFirstEvaluationResponse,
  CreateIndividualEvaluationRequest,
  CreateIndividualEvaluationResponse,
  IndividualEvaluationApi,
  UpdateEvaluationStageRequest,
  UpdateEvaluationStageResponse,
} from "@/types/evaluation";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateFirstEvaluation = () => {
  return useMutation<CreateFirstEvaluationResponse, Error, string>({
    mutationFn: (projectId: string) => createFirstEvaluation(projectId),
    onSuccess: (data) => {
      console.log("First evaluation created successfully:", data.evaluationId);
    },
    onError: (error) => {
      console.error("Failed to create first evaluation:", error);
    },
  });
};

export const useGetEvaluationsByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: ["evaluations", projectId],
    queryFn: () =>
      getEvaluationsByProjectId({
        "project-id": projectId,
        "page-index": 1,
        "page-size": 100,
      }),
    enabled: !!projectId,
  });
};

export const useGetEvaluationStagesByEvaluationId = (evaluationId: string) => {
  return useQuery({
    queryKey: ["evaluation-stages", evaluationId],
    queryFn: () =>
      getEvaluationStagesByEvaluationId({
        "evaluation-id": evaluationId,
        "page-index": 1,
        "page-size": 100,
      }),
    enabled: !!evaluationId,
  });
};

export const useGetEvaluationStagesById = (stageId: string) => {
  return useQuery({
    queryKey: ["evaluation-stages-by-id", stageId],
    queryFn: () => getEvaluationStagesById(stageId),
    enabled: !!stageId,
  });
};

export const useGetIndividualEvaluationsByStageId = (stageId: string) => {
  return useQuery({
    queryKey: ["individual-evaluations", stageId],
    queryFn: () =>
      getIndividualEvaluationsByStageId({
        "evaluation-stage-id": stageId,
        "page-index": 1,
        "page-size": 100,
      }),
    enabled: !!stageId,
  });
};

export const useGetIndividualEvaluationById = (
  individualEvaluationId: string
) => {
  return useQuery({
    queryKey: ["individual-evaluation", individualEvaluationId],
    queryFn: () =>
      getIndividualEvaluationById({
        id: individualEvaluationId,
      }),
    enabled: !!individualEvaluationId,
  });
};

export const useCreateIndividualEvaluation = () => {
  return useMutation<
    CreateIndividualEvaluationResponse,
    Error,
    CreateIndividualEvaluationRequest
  >({
    mutationFn: (request: CreateIndividualEvaluationRequest) =>
      createIndividualEvaluation(request),
    onSuccess: (data) => {
      console.log("Individual evaluation created successfully:", data.id);
    },
    onError: (error) => {
      console.error("Failed to create individual evaluation:", error);
    },
  });
};

export const useUpdateIndividualEvaluation = () => {
  return useMutation<
    IndividualEvaluationApi,
    Error,
    {
      individualId: string;
      evaluationData: {
        name: string;
        "total-rate": number;
        comment: string;
        "reviewer-result": boolean;
      };
    }
  >({
    mutationFn: ({ individualId, evaluationData }) =>
      updateIndividualEvaluation(individualId, evaluationData),
    onSuccess: (data) => {
      console.log("Individual evaluation updated successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to update individual evaluation:", error);
    },
  });
};

export const useUpdateEvaluationStage = () => {
  return useMutation<
    UpdateEvaluationStageResponse,
    Error,
    UpdateEvaluationStageRequest
  >({
    mutationFn: (request: UpdateEvaluationStageRequest) =>
      updateEvaluationStage(request),
    onSuccess: (data) => {
      console.log("Evaluation stage updated successfully:", data.message);
    },
    onError: (error) => {
      console.error("Failed to update evaluation stage:", error);
    },
  });
};
