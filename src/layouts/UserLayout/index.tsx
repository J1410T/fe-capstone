import UserHeader from "@/components/layout/user-header";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <LoadingProvider>
      <div>
        <UserHeader />
        <main>
          <Outlet />
        </main>
      </div>
    </LoadingProvider>
  );
}

export default UserLayout;
