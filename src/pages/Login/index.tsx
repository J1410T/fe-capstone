import { LoginForm } from "./LoginForm";
import StripeCanvas from "./StripeCanvas";

export default function Login() {
  return (
    <div className="relative">
      {/* Canvas in the background */}
      <StripeCanvas />

      {/* Login form in the foreground */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 bg-transparent p-6 md:p-10">
        <div className="flex w-full max-w-lg flex-col gap-6">
          <a href="#" className="logo-container self-center font-medium">
            <img
              src="/images/pg-logo-green.png"
              alt="SRPM Logo"
              className="logo-large"
            />
            <span className="text-2xl font-semibold text-primary font-secondary">
              SRPM
            </span>
          </a>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
