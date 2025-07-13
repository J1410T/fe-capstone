import { MajorItem } from "@/types/major";
import { axiosClient, getAccessToken } from "../api";

export const getMajorsByField = async (fieldId: string) => {
  try {
    const accessToken = getAccessToken();
    const res = await axiosClient.get<MajorItem[]>(
      `/major/by-field/${fieldId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("getMajorsByField error:", error);
    throw error;
  }
};
