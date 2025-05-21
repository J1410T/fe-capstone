import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  User,
  FileText,
  Briefcase,
  History,
  Menu,
  X,
  Bell,
  Search,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  BarChart,
  ChevronDown,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

/**
 * Host Institution layout without sidebar
 */
export const HostLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    {
      name: "Project Management",
      icon: ClipboardList,
      children: [
        { name: "Dashboard", href: "/host/dashboard", icon: BarChart },
        {
          name: "Register Research Project",
          href: "/host/register-project",
          icon: FileText,
        },
        {
          name: "Approve Principal Investigators",
          href: "/host/pi-approval",
          icon: CheckCircle,
        },
      ],
    },
    {
      name: "Research Projects",
      icon: Briefcase,
      children: [
        {
          name: "Project List",
          href: "/host/projects",
          icon: ClipboardList,
        },
        {
          name: "Statistics & Reports",
          href: "/host/history",
          icon: History,
        },
        {
          name: "Progress Alerts",
          href: "/host/alerts",
          icon: AlertCircle,
        },
      ],
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const getPageTitle = () => {
    // Find the active child route
    for (const parent of navigation) {
      for (const child of parent.children) {
        if (isActive(child.href)) {
          return child.name;
        }
      }
    }

    if (location.pathname.startsWith("/host/project/")) {
      return "Project Details";
    }

    return "Host Institution";
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);

    // Base breadcrumb
    const breadcrumbs = [
      { name: "Home", href: "/host/dashboard", current: false },
    ];

    if (paths.includes("projects")) {
      breadcrumbs.push({
        name: "Project List",
        href: "/host/projects",
        current: true,
      });
    } else if (paths.includes("register-project")) {
      breadcrumbs.push({
        name: "Register Research Project",
        href: "/host/register-project",
        current: true,
      });
    } else if (paths.includes("history")) {
      breadcrumbs.push({
        name: "Statistics & Reports",
        href: "/host/history",
        current: true,
      });
    } else if (paths.includes("project")) {
      breadcrumbs.push(
        { name: "Project List", href: "/host/projects", current: false },
        { name: "Project Details", href: "#", current: true }
      );
    } else if (paths.includes("dashboard")) {
      breadcrumbs.push({
        name: "Dashboard",
        href: "/host/dashboard",
        current: true,
      });
    } else if (paths.includes("alerts")) {
      breadcrumbs.push({
        name: "Progress Alerts",
        href: "/host/alerts",
        current: true,
      });
    } else if (paths.includes("pi-approval")) {
      breadcrumbs.push({
        name: "Approve Principal Investigators",
        href: "/host/pi-approval",
        current: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // No longer needed with shadcn dropdowns

  return (
    <LoadingProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6 shadow-sm">
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex h-full flex-col">
                  <div className="flex items-center border-b py-4">
                    <img
                      src="/src/assets/images/logo.png"
                      alt="SRPM Logo"
                      className="h-8 w-auto mr-2"
                    />
                    <span className="text-lg font-semibold text-primary">
                      SRPM
                    </span>
                  </div>
                  <nav className="flex-1 overflow-auto py-4">
                    <div className="space-y-1 px-2">
                      {navigation.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            <item.icon className="inline-block mr-2 h-4 w-4" />
                            {item.name}
                          </div>
                          <div className="pl-4 space-y-1">
                            {item.children.map((child, childIndex) => (
                              <Button
                                key={childIndex}
                                variant={
                                  isActive(child.href) ? "default" : "ghost"
                                }
                                className={`w-full justify-start text-sm`}
                                onClick={() => navigate(child.href)}
                              >
                                <child.icon className="mr-2 h-4 w-4" />
                                {child.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <a
              href="/host/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <img
                src="/src/assets/images/logo.png"
                alt="SRPM Logo"
                className="h-8 w-auto"
              />
              <span className="text-lg text-primary hidden md:block">SRPM</span>
            </a>

            <Separator orientation="vertical" className="mx-4 h-6" />

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      <item.icon className="mr-1 h-4 w-4" />
                      {item.name}
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {item.children.map((child, childIndex) => (
                      <DropdownMenuItem
                        key={childIndex}
                        className={
                          isActive(child.href)
                            ? "bg-primary/10 text-primary"
                            : ""
                        }
                        onClick={() => navigate(child.href)}
                      >
                        <child.icon className="mr-2 h-4 w-4" />
                        {child.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 w-72 flex items-center">
                  <Input
                    placeholder="Search projects..."
                    className="w-full"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:block">
                      {user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
              {/* Breadcrumbs */}
              <div className="mb-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {breadcrumb.current ? (
                            <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href}>
                              {breadcrumb.name}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Page title */}
              <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                    {getPageTitle()}
                  </h2>
                </div>
                {location.pathname.startsWith("/host/project/") && (
                  <div className="mt-4 flex md:mt-0">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/host/projects")}
                      className="ml-3"
                    >
                      Back to Projects
                    </Button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="bg-white rounded-lg shadow p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </LoadingProvider>
  );
};

export default HostLayout;
