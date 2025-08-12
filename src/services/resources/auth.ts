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
  UserFilterRequest,
  UserFilterResponse,
  CreateUserRequest,
  SearchAccountsParams,
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

// export const searchAccounts = async (
//   input: string
// ): Promise<SearchAccountResult[]> => {
//   try {
//     const accessToken = getAccessToken();

//     const res = await axiosClient.get<SearchAccountResult[]>(
//       `/account/search?input=${encodeURIComponent(input)}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return res.data;
//   } catch (error) {
//     console.error("searchAccounts error:", error);
//     throw error;
//   }
// };

export const searchAccounts = async (
  params: SearchAccountsParams
): Promise<SearchAccountResult[]> => {
  try {
    const accessToken = getAccessToken();

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("input", params.input);

    if (params.roleUser) {
      queryParams.append("roleUser", params.roleUser);
    }

    const res = await axiosClient.get<SearchAccountResult[]>(
      `/account/search?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: "*/*",
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

export const getUserRolesByAppraisalCouncil = async (
  appraisalCouncilId: string,
  pageIndex: number = 1,
  pageSize: number = 100
): Promise<UserRoleResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const request = {
      "appraisal-council-id": appraisalCouncilId,
      status: "Approved",
      "page-index": pageIndex,
      "page-size": pageSize,
    };

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
    console.error("getUserRolesByAppraisalCouncil error:", error);
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

    // Status is passed as query parameter, request body contains the user role data
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

export const getUserRoleById = async (
  userRoleId: string
): Promise<UserRole> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.get<UserRole>(`/user-role/${userRoleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("getUserRoleById error:", error);
    throw error;
  }
};

export const deleteUserRole = async (userRoleId: string): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    await axiosClient.delete(`/user-role/${userRoleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("deleteUserRole error:", error);
    throw error;
  }
};

// New functions for Users Management
export const getUserFilter = async (
  request: UserFilterRequest
): Promise<UserFilterResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post<UserFilterResponse>(
      "/account/filter",
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
    console.error("getUserFilter error:", error);
    throw error;
  }
};

export const getUserRoleByAccountId = async (
  accountId: string,
  pageIndex: number = 1,
  pageSize: number = 100
): Promise<UserRoleResponse> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const request = {
      "account-id": accountId,
      "page-index": pageIndex,
      "page-size": pageSize,
    };

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
    console.error("getUserRoleByAccountId error:", error);
    throw error;
  }
};

export const createUser = async (
  request: CreateUserRequest
): Promise<unknown> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.post("/account", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    return res.data;
  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
};

export const updateUserStatus = async (accountId: string): Promise<unknown> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const res = await axiosClient.put(
      `/account/${accountId}/toggle-status`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("updateUserStatus error:", error);
    throw error;
  }
};

// Add these functions to your existing auth.ts service file

export const updateUserRole = async (
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
    console.error("updateUserRole error:", error);
    throw error;
  }
};
