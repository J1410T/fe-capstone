import { FieldItem } from "@/types/field";
import { axiosClient, getAccessToken } from "../api";

export const getAllField = async () => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get<FieldItem>("/field/all", {
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
