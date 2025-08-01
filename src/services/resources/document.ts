// services/resources/document.ts
import { axiosClient, getAccessToken } from "../api";
import {
  CreateDocumentRequest,
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
