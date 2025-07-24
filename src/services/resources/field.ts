import { FieldItem, FieldRequest } from "@/types/field";
import { axiosClient, getAccessToken } from "../api";

export const getAllField = async () => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get<FieldItem[]>("/field/all", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("getAllField error:", error);
    throw error;
  }
};

export const createField = async (data: FieldRequest): Promise<FieldItem> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.post<FieldItem>("/field", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("createField error:", error);
    throw error;
  }
};

export const updateField = async (
  id: string,
  data: FieldRequest
): Promise<FieldItem> => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.put<FieldItem>(`/field/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("updateField error:", error);
    throw error;
  }
};

export const deleteField = async (id: string): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axiosClient.delete(`/field/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("deleteField error:", error);
    throw error;
  }
};
