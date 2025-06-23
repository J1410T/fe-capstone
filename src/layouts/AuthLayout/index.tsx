import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Auth layout for login/register pages
 * Sử dụng LoadingProvider để quản lý loading khi chuyển trang
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
