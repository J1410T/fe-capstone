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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { mockUserLogin } from "@/utils";
import { LogIn, Shield } from "lucide-react";
import GoogleAuthentication from "./components/GoogleAuthentication";
// import { env } from "@/config/env";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleStaffLogin = () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setIsLoading(true);

    // Simulate staff login with mock token
    setTimeout(() => {
      login(mockUserLogin(UserRole.STAFF).credential.token);
      setIsLoading(false);
    }, 1000);
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
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="user" className="flex-1">
                User Login
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex-1">
                Staff Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user">
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
            </TabsContent>

            <TabsContent value="staff">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-3">
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
                <Button
                  type="button"
                  variant="default"
                  className="w-full h-12 text-base bg-indigo-700 hover:bg-indigo-600 text-white"
                  onClick={handleStaffLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
