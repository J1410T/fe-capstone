import { useQuery } from "@tanstack/react-query";
import { AuthResponse } from "@/types/auth";

import { getAuthResponse } from "@/utils/cookie-manager";
import { getAccessToken } from "@/services";
import {
  getAccountById,
  getMyAccountInfo,
  getRoleById,
} from "@/services/resources/auth";

export function useAuthResponse() {
  const data = getAuthResponse<AuthResponse>();
  return { data };
}

export function useMyAccountInfo() {
  return useQuery({
    queryKey: ["account-info"],
    queryFn: getMyAccountInfo,
  });
}

export function useAccessToken() {
  const token = getAccessToken();
  return token;
}

export function useAccountInfo(accountId: string) {
  return useQuery({
    queryKey: ["account-info", accountId],
    queryFn: () => getAccountById(accountId),
    enabled: !!accountId,
  });
}

export function useRoleInfo(roleId: string) {
  return useQuery({
    queryKey: ["role-info", roleId],
    queryFn: () => getRoleById(roleId),
    enabled: !!roleId,
  });
}
