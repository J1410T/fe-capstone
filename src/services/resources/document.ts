// services/resources/document.ts
import { axiosClient, getAccessToken } from "../api";
import { DocumentListResponse } from "@/types/document";

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
