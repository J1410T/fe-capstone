import { evaluationApi } from "@/services/resources/evaluation";
import { CreateFirstEvaluationResponse } from "@/types/evaluation";
import { useMutation } from "@tanstack/react-query";

export const useCreateFirstEvaluation = () => {
  return useMutation<CreateFirstEvaluationResponse, Error, string>({
    mutationFn: (projectId: string) =>
      evaluationApi.createFirstEvaluation(projectId),
    onSuccess: (data) => {
      console.log("First evaluation created successfully:", data.evaluationId);
    },
    onError: (error) => {
      console.error("Failed to create first evaluation:", error);
    },
  });
};
