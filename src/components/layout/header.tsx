import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ClipboardList,
  CheckCircle,
  Briefcase,
  History,
  Bell,
  Menu as MenuIcon,
  User,
  Settings,
  LogOut,
  Home,
  LayoutDashboard,
  FolderOpen,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Define menu items for each role
const menuItemsByRole = {
  [UserRole.MEMBER]: [
    { name: "Home", path: "/member/home", icon: Home },
    { name: "Dashboard", path: "/member/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/member/projects", icon: FolderOpen },
    { name: "Tasks", path: "/member/tasks", icon: ClipboardList },
  ],
  [UserRole.HOST_INSTITUTION]: [
    { name: "Home", path: "/member/home", icon: Home },
    { name: "Projects", path: "/host/projects", icon: FolderOpen },
    {
      name: "Register Project",
      path: "/host/register-project",
      icon: FileText,
    },
    { name: "My Projects", path: "/host/my-projects", icon: Briefcase },
    { name: "History", path: "/host/history", icon: History },
  ],
  [UserRole.PRINCIPAL_INVESTIGATOR]: [
    { name: "Home", path: "/member/home", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Tasks", path: "/tasks", icon: ClipboardList },
  ],
  [UserRole.APPRAISAL_COUNCIL]: [
    { name: "Home", path: "/member/home", icon: Home },
    { name: "PI Approval", path: "/council/pi-approval", icon: CheckCircle },
    { name: "Evaluations", path: "/council/evaluations", icon: FileText },
    { name: "Meetings", path: "/council/meetings", icon: Calendar },
    { name: "Approvals", path: "/council/approvals", icon: CheckSquare },
  ],
  [UserRole.STAFF]: [
    { name: "Home", path: "/member/home", icon: Home },
    { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Tasks", path: "/tasks", icon: ClipboardList },
  ],
};

function FlexibleHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Get menu items based on user role
  const menuItems = user?.role
    ? menuItemsByRole[user.role]
    : menuItemsByRole[UserRole.MEMBER];

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-20 h-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Left: Logo + Menu */}
        <div className="flex items-center space-x-10 h-full">
          {/* Logo */}
          <Link to="/member/home" className="logo-container">
            <img
              src="/src/assets/images/pg-logo-green.png"
              alt="SRPM Logo"
              className="logo-medium"
            />
            <span className="font-bold text-xl leading-7 text-gray-800 font-secondary">
              SRPM
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6 h-full">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                asChild
                className="h-full rounded-none border-b-2 border-transparent hover:border-emerald-500 hover:bg-transparent"
              >
                <Link to={item.path}>{item.name}</Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Right (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Notification Icon */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role || "Member"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>
                <div className="logo-container">
                  <img
                    src="/src/assets/images/pg-logo-green.png"
                    alt="SRPM Logo"
                    className="logo-medium"
                  />
                  <span className="font-bold text-xl leading-7 font-secondary">
                    SRPM
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>

            {/* User Info */}
            <div className="py-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{user?.name || "User"}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.email || "user@example.com"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.role || "Member"}
                </div>
              </div>
            </div>

            <div className="py-4">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/settings");
                    setIsOpen(false);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default FlexibleHeader;
