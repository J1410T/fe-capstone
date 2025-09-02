import {
  CreateFirstEvaluationResponse,
  EvaluationApiResponse,
  EvaluationStageApi,
  EvaluationStageApiResponse,
  GetEvaluationsByProjectIdRequest,
  GetEvaluationStagesByEvaluationIdRequest,
  GetIndividualEvaluationByIdRequest,
  GetIndividualEvaluationsByStageIdRequest,
  IndividualEvaluationApi,
  IndividualEvaluationApiResponse,
  UpdateEvaluationStageRequest,
  UpdateEvaluationStageResponse,
} from "@/types/evaluation";
import { axiosClient, getAccessToken } from "../api";

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
    const accessToken = getAccessToken();
    const response = await axiosClient.post<EvaluationApiResponse>(
      "/evaluation/list",
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export const getEvaluationStagesById = async (
  stageId: string
): Promise<EvaluationStageApi> => {
  try {
    const response = await axiosClient.get<EvaluationStageApi>(
      `/evaluation-stage/${stageId}`,
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
    const accessToken = getAccessToken();

    const response = await axiosClient.get<IndividualEvaluationApi>(
      `/individual-evaluation/${request.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export const getEvaluationById = async (
  evaluationId: string,
  includeStages: boolean = true
) => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.get(
      `/evaluation/${evaluationId}${includeStages ? "?incl=1" : ""}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching evaluation by ID:", error);
    throw error;
  }
};

export const getEvaluationStageById = async (
  stageId: string,
  includeIndividualEvaluations: boolean = true
) => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.get(
      `/evaluation-stage/${stageId}${
        includeIndividualEvaluations ? "?incl=2" : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching evaluation stage by ID:", error);
    throw error;
  }
};

export const getAllEvaluationStages = async (request: {
  "page-index": number;
  "page-size": number;
}): Promise<EvaluationStageApiResponse> => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.post<EvaluationStageApiResponse>(
      "/evaluation-stage/list",
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching all evaluation stages:", error);
    throw error;
  }
};

export const createEvaluationStage = async (stageData: {
  name: string;
  "stage-order": number;
  phrase: string;
  type: string;
  "evaluation-id": string;
  status: string;
}) => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.post("/evaluation-stage", stageData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating evaluation stage:", error);
    throw error;
  }
};

export const createIndividualEvaluation = async (evaluationData: {
  name: string;
  "total-rate": number;
  comment: string;
  "reviewer-result": boolean;
  "is-ai-report": boolean;
  "evaluation-stage-id": string;
  "reviewer-id": string;
}) => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.post(
      "/individual-evaluation",
      evaluationData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { id: response.data };
  } catch (error) {
    console.error("Error creating individual evaluation:", error);
    throw error;
  }
};

export const updateIndividualEvaluation = async (
  individualId: string,
  evaluationData: {
    name: string;
    "total-rate": number;
    comment: string;
    "reviewer-result": boolean;
  }
) => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.put(
      `/individual-evaluation`,
      {
        id: individualId,
        name: evaluationData.name,
        "total-rate": evaluationData["total-rate"],
        comment: evaluationData.comment,
        "reviewer-result": evaluationData["reviewer-result"],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating individual evaluation:", error);
    throw error;
  }
};

export const updateEvaluationStage = async (
  stageData: UpdateEvaluationStageRequest
): Promise<UpdateEvaluationStageResponse> => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.put<UpdateEvaluationStageResponse>(
      "/evaluation-stage",
      stageData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating evaluation stage:", error);
    throw error;
  }
};

export const getProposalsByCouncilId = async (councilId: string) => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.get(
      `/evaluation/list-proposal-by-council/${councilId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching proposals by council ID:", error);
    throw error;
  }
};
