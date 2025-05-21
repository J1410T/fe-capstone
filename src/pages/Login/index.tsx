import { LoginForm } from "./LoginForm";
import StripeCanvas from "./StripeCanvas";

export default function Login() {
  return (
    <div className="relative">
      {/* Canvas in the background */}
      <StripeCanvas />

      {/* Login form in the foreground */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 bg-transparent p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <img
              src="/src/assets/images/logo.png"
              alt="SRPM Logo"
              className="h-10 w-auto"
            />
            <span className="text-lg font-semibold text-primary">SRPM</span>
          </a>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
