import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  FolderOpen,
  // History,
  // Shield,
  // BarChart,
  ClipboardList,
} from "lucide-react";

import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

// Admin navigation data
const adminNavData = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/staff/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      // items: [],
    },
    {
      title: "User Management",
      url: "/staff/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/staff/users",
        },
        {
          title: "Roles",
          url: "/staff/users/roles",
        },
      ],
    },
    {
      title: "Projects",
      url: "/staff/projects",
      icon: FolderOpen,
      items: [
        {
          title: "All Projects",
          url: "/staff/projects",
        },
        {
          title: "Create Project",
          url: "/staff/projects/create",
        },
        {
          title: "Templates",
          url: "/staff/projects/templates",
        },
      ],
    },
    {
      title: "Forms & Approvals",
      url: "/staff/approvals",
      icon: ClipboardList,
      items: [
        {
          title: "Pending Approvals",
          url: "/staff/approvals/pending",
        },
        {
          title: "Budget Requests",
          url: "/staff/approvals/budget",
        },
        {
          title: "Form Templates",
          url: "/staff/approvals/templates",
        },
      ],
    },
    {
      title: "System",
      url: "/staff/system",
      icon: Settings,
      items: [
        {
          title: "Configuration",
          url: "/staff/system/config",
        },
        {
          title: "Logs",
          url: "/staff/system/logs",
        },
        {
          title: "Backup",
          url: "/staff/system/backup",
        },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Recent Projects",
  //     url: "/staff/projects/recent",
  //     icon: History,
  //   },
  //   {
  //     name: "Statistics",
  //     url: "/staff/projects/stats",
  //     icon: BarChart,
  //   },
  //   {
  //     name: "Security",
  //     url: "/staff/security",
  //     icon: Shield,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <div className="text-xl font-bold text-primary">SRPM Admin</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavData.navMain} />
        {/* <NavProjects projects={adminNavData.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            user
              ? {
                  name: user.name,
                  email: user.email,
                  avatar: user.avatar,
                }
              : adminNavData.user
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
