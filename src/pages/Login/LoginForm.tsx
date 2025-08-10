import { useState } from "react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import { LogIn, Shield } from "lucide-react";
import GoogleAuthentication from "./components/GoogleAuthentication";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/services/api";
import { AuthResponse } from "@/types/auth";
import { setAuthResponse } from "@/utils/cookie-manager";

// Google Login Form Component
export function GoogleLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 shadow-lg w-full max-w-md">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-3xl font-secondary">FPTU SRPM</CardTitle>
          <CardDescription className="text-base">
            Science Research Project Management
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="flex flex-col items-center gap-8 py-6">
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg mb-3">
                <LogIn className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Login with Google
              </h3>
              <p className="text-sm text-gray-600">
                Use your FPTU Google account to access the system
              </p>
            </div>
            <GoogleAuthentication />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Staff Login Form Component
export function StaffLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStaffLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosClient.post<AuthResponse>("/auth/login", {
        email,
        password,
        "selected-role": "Staff",
      });

      if (res.data) {
        // Store auth response in encrypted cookie
        setAuthResponse(res.data);

        // Use the token from the API response
        const accessToken = res.data.token;

        if (accessToken) {
          // Use the actual access token from the API response
          login(accessToken);
          navigate("/staff/dashboard");
          toast.success("Login successful!");
        } else {
          toast.error("Invalid response from server.");
        }
      }
    } catch (error) {
      console.error("Failed to login:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 shadow-lg w-full max-w-md">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-3xl font-secondary">FPTU SRPM</CardTitle>
          <CardDescription className="text-base">
            Science Research Project Management
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Staff Portal
            </h3>
            <p className="text-sm text-gray-600">
              Secure access for authorized personnel
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-6"
          >
            <div className="w-full flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-red-500 hover:text-red-400 hover:underline font-medium"
              >
                Forgot your password?
              </Link>
            </div>
            <Button
              type="button"
              variant="default"
              className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
              onClick={handleStaffLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Legacy LoginForm component for backward compatibility (if needed)
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <GoogleLoginForm className={className} {...props} />;
}
