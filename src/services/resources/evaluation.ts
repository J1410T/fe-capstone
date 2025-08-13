import {
  CreateFirstEvaluationResponse,
  EvaluationApiResponse,
  EvaluationStageApiResponse,
  GetEvaluationsByProjectIdRequest,
  GetEvaluationStagesByEvaluationIdRequest,
  GetIndividualEvaluationByIdRequest,
  GetIndividualEvaluationsByStageIdRequest,
  IndividualEvaluationApi,
  IndividualEvaluationApiResponse,
} from "@/types/evaluation";
import { axiosClient } from "../api";

export const createFirstEvaluation = async (
  projectId: string
): Promise<CreateFirstEvaluationResponse> => {
  try {
    const response = await axiosClient.post<string>(
      `/evaluation/first-evaluation?projectId=${projectId}`,
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
};

export const getEvaluationsByProjectId = async (
  request: GetEvaluationsByProjectIdRequest
): Promise<EvaluationApiResponse> => {
  try {
    const response = await axiosClient.post<EvaluationApiResponse>(
      "/evaluation/list",
      request,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching evaluations by project ID:", error);
    throw error;
  }
};

export const getEvaluationStagesByEvaluationId = async (
  request: GetEvaluationStagesByEvaluationIdRequest
): Promise<EvaluationStageApiResponse> => {
  try {
    const response = await axiosClient.post<EvaluationStageApiResponse>(
      "/evaluation-stage/list",
      request,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching evaluation stages by evaluation ID:", error);
    throw error;
  }
};

export const getIndividualEvaluationsByStageId = async (
  request: GetIndividualEvaluationsByStageIdRequest
): Promise<IndividualEvaluationApiResponse> => {
  try {
    const response = await axiosClient.post<IndividualEvaluationApiResponse>(
      "/individual-evaluation/list",
      request,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching individual evaluations by stage ID:", error);
    throw error;
  }
};

export const getIndividualEvaluationById = async (
  request: GetIndividualEvaluationByIdRequest
): Promise<IndividualEvaluationApi> => {
  try {
    const response = await axiosClient.get<IndividualEvaluationApi>(
      `/individual-evaluation/${request.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching individual evaluation by ID:", error);
    throw error;
  }
};
