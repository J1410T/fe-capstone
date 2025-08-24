import { axiosClient, getAccessToken } from "../api";
import { getImageUrlFromAzure } from "./azure-image";

// Types
export interface ResultPublish {
  id?: string;
  url: string;
  title: string;
  description: string;
  publisher: string;
  "publication-date": string;
  "access-type": string;
  tags: string;
}

export interface ProjectResult {
  id?: string;
  name: string;
  url: string | null;
  "project-id": string;
  "added-date": string;
  "result-publishs"?: ResultPublish[];
}

export interface ProjectResultListResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": ProjectResult[];
}

export interface ProjectResultResponse {
  data: ProjectResult;
  success: boolean;
  message?: string;
}

// API functions
export const getProjectResult = async (
  projectId: string
): Promise<ProjectResultResponse> => {
  try {
    const accessToken = getAccessToken();

    // Gọi API list với project-id trong body
    const listResponse = await axiosClient.post<ProjectResultListResponse>(
      "/project-result/list",
      {
        "project-id": projectId,
        "page-index": 0,
        "page-size": 0, // 0 để lấy tất cả
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Lấy result đầu tiên từ data-list (vì đã filter theo project-id)
    const projectResult = listResponse.data["data-list"]?.[0];

    if (projectResult) {
      return {
        data: projectResult,
        success: true,
      };
    } else {
      // Không tìm thấy result cho project này
      return {
        data: {} as ProjectResult,
        success: false,
        message: "No result found for this project",
      };
    }
  } catch (error) {
    console.error("getProjectResult error:", error);
    throw error;
  }
};

export const createProjectResult = async (
  data: Record<string, unknown> // Flexible payload cho basic vs application
): Promise<ProjectResultResponse> => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.post<ProjectResultResponse>(
      "/project-result",
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("createProjectResult error:", error);
    throw error;
  }
};

export const updateProjectResult = async (
  data: Record<string, unknown>
): Promise<ProjectResultResponse> => {
  try {
    const accessToken = getAccessToken();
    console.log("updateProjectResult - sending data:", data);

    const response = await axiosClient.put<ProjectResultResponse>(
      "/project-result",
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("updateProjectResult - response:", response.data);
    return response.data;
  } catch (error) {
    console.error("updateProjectResult error:", error);
    throw error;
  }
};

export const deleteProjectResult = async (
  resultId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const accessToken = getAccessToken();
    const response = await axiosClient.delete<{
      success: boolean;
      message?: string;
    }>(`/project-result/${resultId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("deleteProjectResult error:", error);
    throw error;
  }
};

// File upload function (for Application category)
export const uploadFileToAzure = async (
  file: File
): Promise<{ url: string; success: boolean }> => {
  try {
    const accessToken = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);

    // Step 1: Upload file to Azure and get blob name
    const uploadResponse = await axiosClient.post<{ url: string }>(
      "/azure-image-service/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const blobName = uploadResponse.data.url; // API trả về url field chứa blobName
    if (!blobName) {
      throw new Error("Failed to get blob name from upload response");
    }

    // Step 2: Get the public URL for the uploaded file
    const fileUrl = await getImageUrlFromAzure(blobName);

    return {
      url: fileUrl,
      success: true,
    };
  } catch (error) {
    console.error("uploadFileToAzure error:", error);
    throw error;
  }
};
