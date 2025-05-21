import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { mockGoogleOAuthResponse } from "@/mocks/authMock";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      setIsLoading(true);
      // Use the credential token from Google
      if (credentialResponse.credential) {
        // In a real app, you would send this token to your backend
        // For demo purposes, we'll simulate a successful login
        login(credentialResponse.credential);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">FPTU SRPM</CardTitle>
          <CardDescription>Science Research Project Management</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4 items-center">
                {/* Mock login buttons for testing */}
                <div className="w-full flex flex-col gap-2">
                  <p className="text-sm text-center font-medium mb-2">
                    Select a role to login:
                  </p>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() =>
                      handleGoogleSuccess(
                        mockGoogleOAuthResponse(UserRole.STAFF)
                      )
                    }
                    disabled={isLoading}
                  >
                    Login as Staff
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleGoogleSuccess(
                        mockGoogleOAuthResponse(UserRole.MEMBER)
                      )
                    }
                    disabled={isLoading}
                  >
                    Login as Member
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleGoogleSuccess(
                        mockGoogleOAuthResponse(UserRole.APPRAISAL_COUNCIL)
                      )
                    }
                    disabled={isLoading}
                  >
                    Login as Appraisal Council
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleGoogleSuccess(
                        mockGoogleOAuthResponse(UserRole.HOST_INSTITUTION)
                      )
                    }
                    disabled={isLoading}
                  >
                    Login as Host Institution
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleGoogleSuccess(
                        mockGoogleOAuthResponse(UserRole.PRINCIPAL_INVESTIGATOR)
                      )
                    }
                    disabled={isLoading}
                  >
                    Login as Principal Investigator
                  </Button>
                </div>

                {/* Hidden Google Login Button - will be enabled when backend is ready */}
                <div className="hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
