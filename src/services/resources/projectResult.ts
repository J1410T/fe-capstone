import { axiosClient, getAccessToken } from "../api";

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
  url: string;
  "project-id": string;
  "added-date": string;
  "result-publishs"?: ResultPublish[];
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
    const response = await axiosClient.get<ProjectResultResponse>(
      `/project-result/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("getProjectResult error:", error);
    throw error;
  }
};

export const createProjectResult = async (
  data: Omit<ProjectResult, "id" | "added-date">
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
  data: ProjectResult
): Promise<ProjectResultResponse> => {
  try {
    const accessToken = getAccessToken();
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
    const uploadResponse = await axiosClient.post<{ blobName: string }>(
      "/azure-image-service/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const blobName = uploadResponse.data.blobName;
    if (!blobName) {
      throw new Error("Failed to get blob name from upload response");
    }

    // Step 2: Get the public URL for the uploaded file
    const urlResponse = await axiosClient.get<string>(
      `/azure-image-service/get-url?blobName=${encodeURIComponent(blobName)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      url: urlResponse.data,
      success: true,
    };
  } catch (error) {
    console.error("uploadFileToAzure error:", error);
    throw error;
  }
};
