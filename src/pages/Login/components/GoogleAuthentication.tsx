import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import { axiosClient } from "@/services/api";
import { mockUserLogin } from "@/utils";
import { UserRole } from "@/contexts/auth-types";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components";
import { useState } from "react";
import { AuthResponse } from "@/types/auth";

const GoogleAuthentication = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const loginGoogle = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      // console.log(credentialResponse);
      const token = credentialResponse.access_token;

      if (!token) {
        console.warn("Google token is missing from response.");
        return;
      }

      setIsLoading(true);
      try {
        const res = await axiosClient.post<AuthResponse>(
          `/auth/google-authentication?Token=${token}`
        );

        if (res.data) {
          queryClient.setQueryData<AuthResponse>(["auth-response"], res.data);

          // Use the token from the API response if available, otherwise generate mock token
          let accessToken = res.data.token;

          if (!accessToken) {
            // Fallback to mock token if API doesn't provide one
            const selectedRole = res.data["selected-role"] as UserRole;
            const userRole = Object.values(UserRole).includes(selectedRole)
              ? selectedRole
              : UserRole.RESEARCHER; // fallback to RESEARCHER if invalid role

            accessToken = mockUserLogin(userRole).credential.token;
          }

          login(accessToken);
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
        <img
          src="/images/google-logo.png"
          alt="Google Logo"
          className="h-10 w-10"
        />
        {isLoading ? "Redirecting..." : "Login with Google"}
      </Button>
    </div>
  );
};

export default GoogleAuthentication;
