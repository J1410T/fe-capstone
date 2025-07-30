import {
  AuthInfo,
  AuthResponse,
  CreateUserRoleRequest,
  RoleItem,
  SearchAccountResult,
  UpdateUserRoleRequest,
  UserRole,
  UserRoleFilterRequest,
  UserRoleResponse,
} from "@/types/auth";
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

export const searchAccounts = async (
  input: string
): Promise<SearchAccountResult[]> => {
  try {
    const accessToken = getAccessToken();

    const res = await axiosClient.get<SearchAccountResult[]>(
      `/account/search?input=${encodeURIComponent(input)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("searchAccounts error:", error);
    throw error;
  }
};

export const getAllRoles = async (): Promise<RoleItem[]> => {
  try {
    const accessToken = getAccessToken();

    const res = await axiosClient.get<RoleItem[]>("/role", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("getAllRoles error:", error);
    throw error;
  }
};

export const getUserRolesByProjectId = async (
  projectId: string,
  pageIndex: number = 1,
  pageSize: number = 100
) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post(
      "/user-role/filter",
      {
        "project-id": projectId,
        "page-index": pageIndex,
        "page-size": pageSize,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("getUserRolesByProjectId error:", error);
    throw error;
  }
};

export const getUserRoleByFilter = async (
  request: UserRoleFilterRequest
): Promise<UserRoleResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<UserRoleResponse>(
      "/user-role/filter",
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("getUserRoleByFilter error:", error);
    throw error;
  }
};

export const createUserRole = async (
  request: CreateUserRoleRequest
): Promise<UserRole> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<UserRole>("/user-role", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    return res.data;
  } catch (error) {
    console.error("createUserRole error:", error);
    throw error;
  }
};

export const updateUserRoleStatus = async (
  userRoleId: string,
  status: string,
  request: UpdateUserRoleRequest
): Promise<UserRole> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.put<UserRole>(
      `/user-role/${userRoleId}?Status=${status}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("updateUserRoleStatus error:", error);
    throw error;
  }
};
