import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GoogleAuthResponse } from "@/types/auth";
import { getAccountInfo } from "@/services/resources/auth";

export function useAuthResponse() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<GoogleAuthResponse>(["auth-response"]);
  return { data };
}

export function useAccountInfo() {
  return useQuery({
    queryKey: ["account-info"],
    queryFn: getAccountInfo,
  });
}
