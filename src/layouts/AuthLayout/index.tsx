import { Outlet } from "react-router-dom";
import { LoadingProvider } from "@/contexts/LoadingContext";

/**
 * Layout dành cho các trang xác thực như đăng nhập, đăng ký, quên mật khẩu
 * Sử dụng LoadingProvider để quản lý loading khi chuyển trang
 */
export const AuthLayout = () => {
  return (
    <LoadingProvider>
      <Outlet />
    </LoadingProvider>
  );
};

export default AuthLayout;
