// services/resources/azure-image.ts
import { axiosClient, getAccessToken } from "../api";

export interface AzureImageUploadResponse {
  url: string;
}

export interface AzureImageUrlResponse {
  url?: string;
}

/**
 * Upload ảnh lên Azure Blob Storage
 */
export const uploadImageToAzure = async (
  file: File
): Promise<AzureImageUploadResponse> => {
  try {
    const accessToken = getAccessToken();

    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<AzureImageUploadResponse>(
      "/azure-image-service/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading image to Azure:", error);
    throw error;
  }
};

/**
 * Lấy URL của ảnh từ Azure Blob Storage
 */
export const getImageUrlFromAzure = async (
  blobName: string
): Promise<string> => {
  try {
    const accessToken = getAccessToken();

    const response = await axiosClient.get<string>(
      `/azure-image-service/get-url?blobName=${encodeURIComponent(blobName)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // API trả về string URL trực tiếp
    return response.data;
  } catch (error) {
    console.error("Error getting image URL from Azure:", error);
    throw error;
  }
};

/**
 * Xóa ảnh từ Azure Blob Storage
 */
export const deleteImageFromAzure = async (
  blobName: string
): Promise<string> => {
  try {
    const accessToken = getAccessToken();

    const response = await axiosClient.delete<string>(
      `/azure-image-service/delete/${encodeURIComponent(blobName)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // API trả về "File deleted" message
    return response.data;
  } catch (error) {
    console.error("Error deleting image from Azure:", error);
    throw error;
  }
};
