// services/resources/document.ts
import { axiosClient, getAccessToken } from "../api";
import {
  CreateDocumentRequest,
  DocumentForm,
  DocumentListResponse,
  UpdateDocumentRequest,
  GetDocumentByProjectIdRequest,
  DocumentListWithUserRoleResponse,
  DocumentWithUserRole,
  CreateDocumentByIndividualEvaluationRequest,
  CreateDocumentByIndividualEvaluationResponse,
  CreateMilestoneByDocumentProjectRequest,
  CreateMilestoneByDocumentProjectResponse,
} from "@/types/document";
import { getUserRoleById } from "./auth";

export const getDocumentsByFilter = async (
  type: string,
  isTemplate: boolean = true,
  pageIndex: number = 1,
  pageSize: number = 10,
  status?: string
) => {
  const accessToken = getAccessToken();

  return await axiosClient.post<DocumentListResponse>(
    "/document/list",
    {
      type,
      status,
      "is-template": isTemplate,
      "page-index": pageIndex,
      "page-size": pageSize,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

// Function mới để lấy tất cả document templates
export const getAllDocumentTemplates = async (
  pageIndex: number = 1,
  pageSize: number = 50,
  status?: string
) => {
  const accessToken = getAccessToken();

  return await axiosClient.post<DocumentListResponse>(
    "/document/list",
    {
      status,
      "is-template": true,
      "page-index": pageIndex,
      "page-size": pageSize,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const createDocument = async (data: CreateDocumentRequest) => {
  const accessToken = getAccessToken();

  return await axiosClient.post<string>("/document", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateDocument = async (data: UpdateDocumentRequest) => {
  const accessToken = getAccessToken();

  return await axiosClient.put<string>("/document", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json-patch+json",
    },
  });
};

export const getScientificCVByEmail = async (email: string) => {
  const accessToken = getAccessToken();

  return await axiosClient.get<DocumentForm>(
    `/document/science-cv?email=${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const deleteDocumentById = async (documentId: string) => {
  const accessToken = getAccessToken();

  return await axiosClient.delete<string>(`/document/${documentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getDocumentByProjectId = async (
  request: GetDocumentByProjectIdRequest
) => {
  const accessToken = getAccessToken();

  return await axiosClient.post<DocumentListResponse>(
    "/document/list",
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    }
  );
};

export const getDocumentByProjectIdWithUserRole = async (
  request: GetDocumentByProjectIdRequest
): Promise<DocumentListWithUserRoleResponse> => {
  try {
    // First, get the documents
    const documentsResponse = await getDocumentByProjectId(request);
    const documents = documentsResponse.data["data-list"] || [];

    // Then, fetch user role data for each document
    const documentsWithUserRole: DocumentWithUserRole[] = await Promise.all(
      documents.map(async (document) => {
        try {
          const userRole = await getUserRoleById(document["uploader-id"]);
          return {
            ...document,
            "account-id": userRole["account-id"],
            "full-name": userRole["full-name"],
            "avatar-url": userRole["avatar-url"] || undefined,
          };
        } catch (error) {
          console.warn(
            `Failed to fetch user role for uploader ${document["uploader-id"]}:`,
            error
          );
          // Return document without user role data if the API call fails
          return {
            ...document,
            "account-id": undefined,
            "full-name": undefined,
            "avatar-url": undefined,
          };
        }
      })
    );

    // Return the combined response in the requested format
    return {
      "page-index": documentsResponse.data["page-index"],
      "page-size": documentsResponse.data["page-size"],
      "total-count": documentsResponse.data["total-count"],
      "total-page": documentsResponse.data["total-page"],
      "data-list": documentsWithUserRole,
    };
  } catch (error) {
    console.error("Failed to fetch documents with user role data:", error);
    throw error;
  }
};

export const getDocumentById = async (documentId: string) => {
  const accessToken = getAccessToken();

  return await axiosClient.get<DocumentForm>(`/document/${documentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createDocumentByIndividualEvaluation = async (
  request: CreateDocumentByIndividualEvaluationRequest
): Promise<CreateDocumentByIndividualEvaluationResponse> => {
  try {
    const accessToken = getAccessToken();

    const response = await axiosClient.post<string>("/document", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    return {
      id: response.data,
    };
  } catch (error) {
    console.error("Error creating document by individual evaluation:", error);
    throw error;
  }
};

export const createMilestoneByDocumentProject = async (
  request: CreateMilestoneByDocumentProjectRequest
): Promise<CreateMilestoneByDocumentProjectResponse> => {
  try {
    const accessToken = getAccessToken();

    const response = await axiosClient.post<string>(
      "/project/document",
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return {
      id: response.data,
    };
  } catch (error) {
    console.error("Error creating milestone by document project:", error);
    throw error;
  }
};
