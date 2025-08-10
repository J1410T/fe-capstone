import { Navigate, RouteObject } from "react-router-dom";
import Login from "@/pages/Login";
import StaffLogin from "@/pages/Login/StaffLogin";
import ForgotPassword from "@/pages/Login/components/ForgotPassword";

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="login" replace />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "login-staff",
    element: <StaffLogin />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
];
