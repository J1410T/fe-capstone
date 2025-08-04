// services/resources/document.ts
import { axiosClient, getAccessToken } from "../api";
import {
  CreateDocumentRequest,
  DocumentForm,
  DocumentListResponse,
  UpdateDocumentRequest,
} from "@/types/document";

export const getDocumentsByFilter = async (
  type: string,
  isTemplate: boolean = true,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  const accessToken = getAccessToken();

  return await axiosClient.post<DocumentListResponse>(
    "/document/list",
    {
      type,
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
