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

interface FormData {
  email: string;
  otp: string;
  password: string;
  confirm: string;
}

export default function ForgotPassword() {
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendEmail = () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email!");
      return;
    }
    setEmail(formData.email);
    toast.success("Verification code sent to your email.");
    setStep(2);
  };

  const handleVerifyOTP = () => {
    if (!formData.otp.trim()) {
      toast.error("Please enter the OTP code!");
      return;
    }
    toast.success("OTP verified successfully.");
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!formData.password.trim() || !formData.confirm.trim()) {
      toast.error("Please fill in all password fields!");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    if (formData.password !== formData.confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    toast.success("Password reset successfully!");
    setStep(1);
    setFormData({ email: "", otp: "", password: "", confirm: "" });
  };

  const handleResendEmail = () => {
    if (!email) return;
    toast.success(`Verification code resent to ${email}`);
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
                  />
                  <Button
                    variant="default"
                    className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
                    onClick={handleSendEmail}
                  >
                    Send Verification Code
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
                    maxLength={5}
                  />
                  <Button
                    variant="default"
                    className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
                    onClick={handleVerifyOTP}
                  >
                    Verify OTP
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Didn’t get the email?{" "}
                    <button
                      onClick={handleResendEmail}
                      className="text-emerald-700 hover:underline font-medium"
                    >
                      Resend
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
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirm}
                      onChange={(e) =>
                        handleInputChange("confirm", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirm((prev) => !prev)}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <Button
                    variant="default"
                    className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-600 text-white"
                    onClick={handleResetPassword}
                  >
                    Update Password
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
