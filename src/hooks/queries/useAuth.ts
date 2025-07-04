import { getGoogleAuthResponse } from "@/services/resources/auth";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export function useAuthResponse() {
  const sessionId = Cookies.get("sessionId");
  console.log("useAuthResponse: sessionId", sessionId);
  return useQuery({
    queryKey: ["auth-response"],
    queryFn: getGoogleAuthResponse,
    refetchOnWindowFocus: false,
    enabled: !!sessionId,
    retry: false,
  });
}
