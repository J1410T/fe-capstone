import { getGoogleAuthResponse } from "@/services/resources/auth";
import { useQuery } from "@tanstack/react-query";

export function useAuthResponse(token: string | undefined) {
  return useQuery({
    queryKey: ["auth-response"],
    queryFn: () => getGoogleAuthResponse(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 60 * 5, // 5 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
