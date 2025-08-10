import { CreateFirstEvaluationResponse } from "@/types/evaluation";
import { axiosClient } from "../api";

export const evaluationApi = {
  createFirstEvaluation: async (
    projectId: string
  ): Promise<CreateFirstEvaluationResponse> => {
    try {
      const response = await axiosClient.post<string>(
        "/evaluation/first-evaluation",
        `"${projectId}"`,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }
      );

      return {
        evaluationId: response.data,
      };
    } catch (error) {
      console.error("Error creating first evaluation:", error);
      throw error;
    }
  },
};
