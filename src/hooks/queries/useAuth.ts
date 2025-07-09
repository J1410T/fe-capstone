import { useQueryClient } from "@tanstack/react-query";
import { GoogleAuthResponse } from "@/types/auth";

export function useAuthResponse() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<GoogleAuthResponse>(["auth-response"]);
  return { data };
}
