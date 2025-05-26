import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Briefcase,
  History,
  Menu,
  X,
  Bell,
  Search,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

/**
 * Council layout without sidebar
 */
export const CouncilLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    {
      name: "Council Management",
      icon: ClipboardList,
      children: [
        {
          name: "PI Evaluation",
          href: "/council/pi-approval",
          icon: CheckCircle,
        },
      ],
    },
    {
      name: "Project Evaluation",
      icon: Briefcase,
      children: [
        {
          name: "Pending Evaluations",
          href: "/council/evaluations",
          icon: ClipboardList,
        },
        {
          name: "Meeting Schedule",
          href: "/council/meetings",
          icon: History,
        },
        {
          name: "Evaluation History",
          href: "/council/history",
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
                  <div className="logo-container border-b py-4">
                    <img
                      src="/src/assets/images/pg-logo-green.png"
                      alt="SRPM Logo"
                      className="logo-medium"
                    />
                    <span className="text-lg font-semibold text-primary font-secondary">
                      SRPM
                    </span>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    <nav className="grid gap-1 px-2">
                      {navigation.map((group, idx) => (
                        <Collapsible key={idx} className="w-full">
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex w-full justify-between p-2"
                            >
                              <div className="flex items-center">
                                <group.icon className="mr-2 h-4 w-4" />
                                <span>{group.name}</span>
                              </div>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="pl-4">
                              {group.children.map((item, itemIdx) => (
                                <Button
                                  key={itemIdx}
                                  variant="ghost"
                                  className={`flex w-full justify-start p-2 ${
                                    isActive(item.href)
                                      ? "bg-primary/10 text-primary"
                                      : ""
                                  }`}
                                  onClick={() => navigate(item.href)}
                                >
                                  <item.icon className="mr-2 h-4 w-4" />
                                  <span>{item.name}</span>
                                </Button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="logo-container">
              <img
                src="/src/assets/images/pg-logo-green.png"
                alt="SRPM Logo"
                className="logo-medium"
              />
              <span className="text-lg font-semibold text-primary font-secondary">
                SRPM
              </span>
            </div>

            <Separator orientation="vertical" className="mx-4 h-6" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigation.map((group, idx) => (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      <group.icon className="h-4 w-4 mr-1" />
                      {group.name}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {group.children.map((item, itemIdx) => (
                      <DropdownMenuItem
                        key={itemIdx}
                        className={isActive(item.href) ? "bg-primary/10" : ""}
                        onClick={() => navigate(item.href)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:flex">
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 flex w-60 items-center">
                  <Input
                    autoFocus
                    type="search"
                    placeholder="Search..."
                    className="w-full"
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

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </LoadingProvider>
  );
};

export default CouncilLayout;
