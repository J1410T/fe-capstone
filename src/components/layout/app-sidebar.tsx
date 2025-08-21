import * as React from "react";
import {
  LayoutDashboard,
  ChevronsUpDown,
  Users,
  FolderOpen,
  DollarSign,
  FileText,
  BookOpen,
  Building2,
  LogOut,
  User,
  Calendar,
  BellDot,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthResponse } from "@/hooks/queries";

// Navigation data structure
const data = {
  navMain: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/staff",
          icon: LayoutDashboard,
        },
        {
          title: "Notifications",
          url: "/staff/notifications",
          icon: BellDot,
        },
        {
          title: "Document Forms",
          url: "/staff/forms",
          icon: FileText,
        },
        {
          title: "Contract Management",
          url: "/staff/documents",
          icon: FileText,
        },
      ],
    },
    {
      title: "Projects",
      items: [
        {
          title: "Project Overview",
          url: "/staff/projects",
          icon: LayoutDashboard,
        },
        {
          title: "Project Registration",
          url: "/staff/projects/register",
          icon: FolderOpen,
        },

        {
          title: "Project Payments",
          url: "/staff/payments",
          icon: DollarSign,
        },
        {
          title: "Meeting Management",
          url: "/staff/meetings",
          icon: Calendar,
        },
      ],
    },
    {
      title: "People",
      items: [
        {
          title: "Users Management",
          url: "/staff/users",
          icon: Users,
        },
        {
          title: "Appraisal Councils",
          url: "/staff/councils",
          icon: Users,
        },
      ],
    },
    {
      title: "Academics",
      items: [
        {
          title: "Academic Fields",
          url: "/staff/fields",
          icon: BookOpen,
        },
        {
          title: "Academic Majors",
          url: "/staff/majors",
          icon: Building2,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Config System",
          url: "/staff/config-system",
          icon: Settings,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const { data: authData } = useAuthResponse();

  // Get current user role
  const currentRole = authData?.["selected-role"] || user?.role;

  // Filter menu items based on role
  const getFilteredNavItems = (items: (typeof data.navMain)[0]["items"]) => {
    return items.filter((item) => {
      // Only Admin can see Config System
      if (item.title === "Config System") {
        return currentRole === UserRole.ADMIN;
      }
      // Both Staff and Admin can see Users Management
      if (item.title === "Users Management") {
        return currentRole === UserRole.ADMIN || currentRole === UserRole.STAFF;
      }
      // All other items are visible to both Staff and Admin
      return true;
    });
  };

  const displayUser = {
    name: authData?.["full-name"] || user?.name || "Staff",
    email: authData?.email || user?.email || "user@example.com",
    role: authData?.["selected-role"] || user?.role || "STAFF",
    avatar:
      authData?.["avatar-url"] ||
      user?.avatar ||
      "https://assets.beyondtrust.com/assets/images/resource-cards/resource-default.jpg?auto=format&fit=clip&q=40&speed=0&w=446",
  };

  const handleLogout = () => {
    logout();
  };

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
        {data.navMain.map((group) => {
          const filteredItems = getFilteredNavItems(group.items);

          // Don't render group if no items are visible
          if (filteredItems.length === 0) return null;

          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredItems.map((item) => (
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
          );
        })}
      </SidebarContent>

      {/* Footer with User Info and Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={displayUser.avatar}
                      alt={displayUser.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {displayUser.name}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {displayUser.name}
                    </span>
                    <span className="truncate text-xs">
                      {displayUser.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-600" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
