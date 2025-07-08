import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import { GoogleAuthResponse } from "@/types/auth";
import { axiosClient } from "@/services/api";
import { mockUserLogin } from "@/utils";
import { UserRole } from "@/contexts/auth-types";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components";
import { useState } from "react";
import { LogIn } from "lucide-react";

const GoogleAuthentication = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const loginGoogle = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log(credentialResponse);
      const token = credentialResponse.access_token;

      if (!token) {
        console.warn("Google token is missing from response.");
        return;
      }

      setIsLoading(true);
      try {
        const res = await axiosClient.post<GoogleAuthResponse>(
          `/auth/google-authentication?Token=${token}`
        );

        if (res.data) {
          queryClient.setQueryData<GoogleAuthResponse>(
            ["auth-response"],
            res.data
          );
          login(mockUserLogin(UserRole.RESEARCHER).credential.token);
          navigate("/home");
        }
      } catch (error) {
        console.error("Failed to fetch Google auth response:", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Failed to login with Google:", error);
      setIsLoading(false);
    },
  });

  return (
    <div>
      <Button
        type="button"
        variant="default"
        className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
        onClick={() => loginGoogle()}
        disabled={isLoading}
      >
        <LogIn className="h-5 w-5" />
        {isLoading ? "Redirecting..." : "Login with Google"}
      </Button>
    </div>
  );
};

export default GoogleAuthentication;
