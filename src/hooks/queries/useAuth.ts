import { useQuery } from "@tanstack/react-query";
import { AuthResponse } from "@/types/auth";
import { getAccountInfo } from "@/services/resources/auth";
import { getAuthResponse } from "@/utils/cookie-manager";

export function useAuthResponse() {
  const data = getAuthResponse<AuthResponse>();
  return { data };
}

export function useAccountInfo() {
  return useQuery({
    queryKey: ["account-info"],
    queryFn: getAccountInfo,
  });
}
