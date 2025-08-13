import {
  createFirstEvaluation,
  getEvaluationsByProjectId,
  getEvaluationStagesByEvaluationId,
  getIndividualEvaluationById,
  getIndividualEvaluationsByStageId,
} from "@/services/resources/evaluation";
import { CreateFirstEvaluationResponse } from "@/types/evaluation";
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
