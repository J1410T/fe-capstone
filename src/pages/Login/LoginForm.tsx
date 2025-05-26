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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { mockGoogleOAuthResponse } from "@/mocks/authMock";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
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

  const handleLoginWithRole = () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue.");
      return;
    }

    try {
      setIsLoading(true);
      // Simulate login with selected role
      handleGoogleSuccess(mockGoogleOAuthResponse(selectedRole as UserRole));
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 shadow-lg w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-secondary">FPTU SRPM</CardTitle>
          <CardDescription className="text-base">
            Science Research Project Management
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form>
            <div className="grid gap-8">
              <div className="flex flex-col gap-6 items-center">
                {/* Role Selection */}
                <div className="w-full space-y-4">
                  <Label
                    htmlFor="role-select"
                    className="text-base font-medium text-center block"
                  >
                    Select your role to continue:
                  </Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) =>
                      setSelectedRole(value as UserRole)
                    }
                  >
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Choose your role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                      <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                      <SelectItem value={UserRole.APPRAISAL_COUNCIL}>
                        Appraisal Council
                      </SelectItem>
                      <SelectItem value={UserRole.HOST_INSTITUTION}>
                        Host Institution
                      </SelectItem>
                      <SelectItem value={UserRole.PRINCIPAL_INVESTIGATOR}>
                        Principal Investigator
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Login Button */}
                <div className="w-full">
                  <Button
                    type="button"
                    variant="default"
                    className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
                    onClick={handleLoginWithRole}
                    disabled={isLoading || !selectedRole}
                  >
                    {isLoading ? "Logging in..." : "Login"}
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
