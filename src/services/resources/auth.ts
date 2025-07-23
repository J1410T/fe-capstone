import { AuthInfo, AuthResponse, RoleItem } from "@/types/auth";
import { axiosClient, getAccessToken } from "../api";

export const getMyAccountInfo = async () => {
  try {
    const accessToken = getAccessToken();

    const res = await axiosClient.get<AuthInfo>("/account/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("getAccountInfo error:", error);
    throw error;
  }
};

export const getAccountById = async (accountId: string) => {
  try {
    const accessToken = getAccessToken();

    const res = await axiosClient.get<AuthInfo>(`/account/${accountId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getAccountById response:", res.data);
    return res.data;
  } catch (error) {
    console.error("getAccountById error:", error);
    throw error;
  }
};

export const getRoleById = async (roleId: string) => {
  try {
    const accessToken = getAccessToken();

    const res = await axiosClient.get<RoleItem>(`/role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getRoleById response:", res.data);
    return res.data;
  } catch (error) {
    console.error("getRoleById error:", error);
    throw error;
  }
};

export const setMyRole = async (roleName: string) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token available");
    }

    return await axiosClient.post<AuthResponse>(
      `/auth/switch-role?selectedSwitchRole=${encodeURIComponent(roleName)}`,
      {}, // Empty body as per curl example
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error("Error in setMyRole:", error);
    throw error;
  }
};
