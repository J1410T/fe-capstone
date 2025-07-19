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
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Simple navigation items
const navigationItems = [
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
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <div className="text-xl font-bold text-primary">SRPM Staff</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-3 py-2">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-gray-500">Staff Portal</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
