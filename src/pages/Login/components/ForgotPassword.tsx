import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Shield } from "lucide-react";
import StripeCanvas from "../StripeCanvas";
import { useNavigate } from "react-router-dom";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@/hooks/queries";
import { AxiosError } from "axios";

interface FormData {
  email: string;
  otp: string;
  password: string;
  confirm: string;
}

interface ApiErrorResponse {
  message: string;
}

// Helper function để extract error message từ API response
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse | undefined;
    if (apiError?.message) {
      return apiError.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    password: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const forgotPasswordMutation = useForgotPasswordMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  // loading riêng cho từng step
  const isSendingEmail = forgotPasswordMutation.isPending;
  const isVerifyingOtp = verifyOtpMutation.isPending;
  const isResettingPassword = resetPasswordMutation.isPending;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // validate password rule
  const validatePassword = (pwd: string): string => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long!";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return "Password must contain at least one special character!";
    }
    if (/\s/.test(pwd)) {
      return "Password must not contain spaces!";
    }
    return "";
  };

  const handleSendEmail = async () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      const response = await forgotPasswordMutation.mutateAsync(formData.email);
      setEmail(formData.email);
      toast.success(response.message);
      setStep(2);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp.trim()) {
      toast.error("Please enter the OTP code!");
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        email: formData.email,
        otp: formData.otp,
      });
      toast.success(response.message);
      setStep(3);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResetPassword = async () => {
    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setPasswordError(pwdError);
      toast.error(pwdError);
      return;
    }

    if (!formData.confirm.trim()) {
      toast.error("Please confirm your password!");
      return;
    }

    if (formData.password !== formData.confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await resetPasswordMutation.mutateAsync({
        email: formData.email,
        otp: formData.otp,
        "new-password": formData.password,
        "confirm-password": formData.confirm,
      });
      toast.success(response.message);
      setStep(1);
      setFormData({ email: "", otp: "", password: "", confirm: "" });
      navigate("/auth/login-staff");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      await forgotPasswordMutation.mutateAsync(email);
      toast.success(`Verification code resent to ${email}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Canvas */}
      <StripeCanvas />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col gap-6 w-full max-w-md">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-3xl font-secondary">
                FPTU SRPM
              </CardTitle>
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
                  Forgot Password
                </h3>
                <p className="text-sm text-gray-600">
                  {step === 1 && "Enter your email to reset your password"}
                  {step === 2 && (
                    <>
                      We sent a code to{" "}
                      <span className="font-medium text-emerald-700">
                        {email}
                      </span>
                    </>
                  )}
                  {step === 3 && "Create a strong password for your account"}
                </p>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isSendingEmail}
                  />
                  <Button
                    variant="default"
                    className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
                    onClick={handleSendEmail}
                    disabled={isSendingEmail}
                  >
                    {isSendingEmail ? "Sending..." : "Send Verification Code"}
                  </Button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value)}
                    maxLength={6}
                    disabled={isVerifyingOtp}
                  />
                  <Button
                    variant="default"
                    className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
                    onClick={handleVerifyOTP}
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Didn't get the email?{" "}
                    <button
                      onClick={handleResendEmail}
                      className="text-emerald-700 hover:underline font-medium disabled:opacity-50"
                      disabled={isSendingEmail}
                    >
                      {isSendingEmail ? "Sending..." : "Resend"}
                    </button>
                  </p>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) => {
                        handleInputChange("password", e.target.value);
                        const err = validatePassword(e.target.value);
                        setPasswordError(err);
                      }}
                      disabled={isResettingPassword}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isResettingPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}

                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirm}
                      onChange={(e) =>
                        handleInputChange("confirm", e.target.value)
                      }
                      disabled={isResettingPassword}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      disabled={isResettingPassword}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <Button
                    variant="default"
                    className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
