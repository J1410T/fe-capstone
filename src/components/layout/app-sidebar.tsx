import * as React from "react";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  DollarSign,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Navigation data structure
const data = {
  navMain: [
    {
      title: "Main Navigation",
      items: [
        {
          title: "Dashboard",
          url: "/staff",
          icon: LayoutDashboard,
        },
        {
          title: "BM Forms",
          url: "/staff/forms",
          icon: FileText,
        },
        {
          title: "Register Project",
          url: "/staff/projects/register",
          icon: FolderOpen,
        },
        {
          title: "Project Assignments",
          url: "/staff/projects/assignments",
          icon: Users,
        },
        {
          title: "Approvals",
          url: "/staff/approvals",
          icon: CheckCircle,
        },
        {
          title: "Payments",
          url: "/staff/payments",
          icon: DollarSign,
        },
        {
          title: "User Management",
          url: "/staff/users",
          icon: Users,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center px-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="logo-container flex items-center space-x-3 group-data-[collapsible=icon]:space-x-0">
            <img
              src="/images/pg-logo-green.png"
              alt="SRPM Logo"
              className="logo-medium group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:object-contain transition-all duration-200"
            />
            <span className="font-bold text-xl leading-7 text-gray-800 font-secondary group-data-[collapsible=icon]:hidden">
              SRPM
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
