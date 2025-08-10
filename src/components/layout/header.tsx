import { useEffect, useState } from "react";
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
  LogOut,
  Home,
  LayoutDashboard,
  FolderOpen,
  Calendar,
  BellRing,
  Clock,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { useAccessToken, useAuthResponse } from "@/hooks/queries";
import { getAuthResponse } from "@/utils/cookie-manager";
import { AuthResponse } from "@/types/auth";
import {
  useMarkNotification,
  useNotificationList,
} from "@/hooks/queries/notification";

const menuItemsByRole = {
  [UserRole.RESEARCHER]: [
    { name: "Home", path: "/home", icon: Home },
    { name: "Projects", path: "/researcher/projects", icon: FolderOpen },
    { name: "Tasks", path: "/researcher/tasks", icon: ClipboardList },
    { name: "My Projects", path: "/researcher/my-projects", icon: Briefcase },
  ],
  [UserRole.HOST_INSTITUTION]: [
    { name: "Home", path: "/home", icon: Home },
    { name: "Projects", path: "/host/projects", icon: FolderOpen },
    {
      name: "Register Project",
      path: "/host/register-project",
      icon: FileText,
    },
    // { name: "My Projects", path: "/host/my-projects", icon: Briefcase },
    { name: "History", path: "/host/history", icon: History },
  ],
  [UserRole.PRINCIPAL_INVESTIGATOR]: [
    { name: "Home", path: "/home", icon: Home },
    { name: "Projects", path: "/pi/projects", icon: FolderOpen },
    { name: "My Projects", path: "/pi/my-projects", icon: Briefcase },
    { name: "Meetings", path: "/pi/meetings", icon: Calendar },
    { name: "Forms", path: "/pi/forms", icon: FileText },
    // { name: "Progress", path: "/pi/progress-reports", icon: FileText },
  ],
  [UserRole.APPRAISAL_COUNCIL]: [
    { name: "Home", path: "/home", icon: Home },
    { name: "My Council", path: "/council/my-council", icon: Briefcase },
    {
      name: "Project Approval",
      path: "/council/project-approval",
      icon: CheckCircle,
    },
    { name: "Evaluations", path: "/council/evaluations", icon: FileText },
    { name: "Meetings", path: "/council/meetings", icon: Calendar },
  ],
  [UserRole.STAFF]: [
    { name: "Home", path: "/home", icon: Home },
    { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/staff/projects", icon: FolderOpen },
    { name: "Tasks", path: "/staff/tasks", icon: ClipboardList },
  ],
};

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data: authData } = useAuthResponse();
  const accessToken = useAccessToken();

  // Use real notification API
  const { data: notificationData, refetch: refetchNotifications } =
    useNotificationList(1, 10);
  const markNotificationMutation = useMarkNotification();

  console.log("token: ", accessToken);

  // Get user display data from auth-response if available, otherwise fallback to user context
  const displayUser = {
    name: authData?.["full-name"] || user?.name || "User",
    email: authData?.email || user?.email || "user@example.com",
    role: authData?.["selected-role"] || user?.role || "RESEARCHER",
    avatar:
      authData?.["avatar-url"] ||
      user?.avatar ||
      "https://assets.beyondtrust.com/assets/images/resource-cards/resource-default.jpg?auto=format&fit=clip&q=40&speed=0&w=446",
  };

  // Get menu items based on current selected role (from auth-response or user context)
  const currentRole = (authData?.["selected-role"] as UserRole) || user?.role;
  const menuItems = currentRole
    ? menuItemsByRole[currentRole]
    : menuItemsByRole[UserRole.RESEARCHER];

  const handleProfileClick = () => {
    // Navigate to role-specific profile page based on current selected role
    if (currentRole === "Principal Investigator") {
      navigate("/pi/profile");
    } else if (currentRole === "Researcher") {
      navigate("/researcher/profile");
    } else if (currentRole === "Host Institution") {
      navigate("/host/profile");
    } else if (currentRole === "Appraisal Council") {
      navigate("/council/profile");
    } else if (currentRole === "Staff") {
      navigate("/staff/profile");
    } else {
      // Fallback to RESEARCHER profile for unknown roles
      navigate("/researcher/profile");
    }
    setIsOpen(false);
  };

  // Get notifications from API data
  const notifications = notificationData?.["data-list"] || [];

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationMutation.mutateAsync({
        notification: notificationId,
      });
      refetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  useEffect(() => {
    const result = getAuthResponse<AuthResponse>();
    console.log("🍪 Auth response result:", result);
  });

  const markAllAsRead = async () => {
    try {
      await markNotificationMutation.mutateAsync({});
      refetchNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n["is-read"]).length;

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "text-blue-600 bg-blue-50";
      case "info":
        return "text-emerald-600 bg-emerald-50";
      case "meeting":
        return "text-purple-600 bg-purple-50";
      case "success":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleViewAllNotifications = () => {
    // Navigate to role-specific notifications page
    if (user?.role === UserRole.STAFF) {
      navigate("/staff/notifications");
    } else if (user?.role === UserRole.HOST_INSTITUTION) {
      navigate("/host/notifications");
    } else if (user?.role === UserRole.PRINCIPAL_INVESTIGATOR) {
      navigate("/pi/notifications");
    } else if (user?.role === UserRole.APPRAISAL_COUNCIL) {
      navigate("/council/notifications");
    } else {
      // Default to researcher notifications
      navigate("/researcher/notifications");
    }
  };

  return (
    <header className="w-full border-b border-gray-200/70 bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-20 h-16 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Left: Logo + Menu */}
        <div className="flex items-center space-x-12 h-full">
          {/* Logo */}
          <Link
            to="/home"
            className="logo-container flex items-center space-x-3 flex-shrink-0"
          >
            <img
              src="/images/pg-logo-green.png"
              alt="SRPM Logo"
              className="logo-medium"
            />
            <span className="font-bold text-xl leading-7 text-gray-800 font-secondary tracking-tight">
              SRPM
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-1 h-full">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                asChild
                className="h-11 px-4 rounded-lg font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all duration-200 relative group"
              >
                <Link to={item.path} className="flex items-center space-x-2">
                  <item.icon className="hidden" />
                  <span>{item.name}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white rounded-full shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
              <DropdownMenuLabel className="flex items-center justify-between py-4 px-4 border-b bg-gray-50/50">
                <span className="font-semibold text-gray-900">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-auto p-1 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                  >
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <BellRing className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">No notifications</p>
                    <p className="text-xs text-gray-400 mt-1">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    // Map notification type to icon
                    const getNotificationIcon = (type: string) => {
                      switch (type) {
                        case "project":
                          return FolderOpen;
                        case "meeting":
                          return Calendar;
                        case "task":
                          return ClipboardList;
                        default:
                          return Bell;
                      }
                    };

                    const IconComponent = getNotificationIcon(
                      notification.type
                    );

                    // Format date
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const now = new Date();
                      const diffInHours = Math.floor(
                        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
                      );

                      if (diffInHours < 1) return "Just now";
                      if (diffInHours < 24) return `${diffInHours} hours ago`;
                      const diffInDays = Math.floor(diffInHours / 24);
                      if (diffInDays < 7) return `${diffInDays} days ago`;
                      return date.toLocaleDateString();
                    };

                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-0 focus:bg-gray-50 cursor-pointer"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div
                          className={`w-full p-4 border-b border-gray-100 last:border-0 ${
                            !notification["is-read"] ? "bg-blue-50/30" : ""
                          } hover:bg-gray-50 transition-colors`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full flex-shrink-0 ${getNotificationTypeColor(
                                notification.type
                              )}`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`text-sm font-medium text-gray-900 ${
                                    !notification["is-read"]
                                      ? "font-semibold"
                                      : ""
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {formatDate(notification["create-date"])}
                                </span>
                                {!notification["is-read"] && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto animate-pulse"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </div>
              <>
                <Separator />
                <DropdownMenuItem
                  className="p-3 text-center text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium cursor-pointer"
                  onClick={handleViewAllNotifications}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View all notifications
                </DropdownMenuItem>
              </>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                  <AvatarImage
                    src={displayUser.avatar}
                    alt={displayUser.name}
                  />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                    {displayUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4 bg-gray-50/50 border-b">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold leading-none text-gray-900">
                    {displayUser.name}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {displayUser.email}
                  </p>
                  <Badge
                    variant="secondary"
                    className="w-fit text-xs font-medium"
                  >
                    {displayUser.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <div className="p-1">
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer"
                >
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <span>Profile Settings</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                </DropdownMenuItem>
                <RoleSwitcher />
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4 text-red-600" />
                  <span className="text-red-600">Sign Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 rounded-full hover:bg-gray-100"
              >
                <MenuIcon className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-emerald-50 to-green-50">
                <SheetTitle className="text-left">
                  <div className="logo-container flex items-center space-x-3">
                    <img
                      src="/images/pg-logo-green.png"
                      alt="SRPM Logo"
                      className="logo-medium"
                    />
                    <span className="font-bold text-xl leading-7 font-secondary text-gray-800">
                      SRPM
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* User Profile Section */}
              <div className="p-6 bg-gray-50/50 border-b">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-emerald-100">
                    <AvatarImage
                      src={displayUser.avatar}
                      alt={displayUser.name}
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-lg">
                      {displayUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {displayUser.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {displayUser.email}
                    </div>
                    <Badge
                      variant="secondary"
                      className="mt-1 w-fit text-xs font-medium"
                    >
                      {displayUser.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Role Switcher - Mobile */}
              <div className="p-4 border-b bg-white">
                <RoleSwitcher
                  variant="mobile"
                  onRoleChange={() => setIsOpen(false)}
                />
              </div>

              {/* Navigation Menu */}
              <div className="p-4 flex-1">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    Navigation
                  </div>
                  {menuItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-12 px-3 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium transition-colors group"
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="flex-shrink-0 p-1 rounded-md group-hover:bg-emerald-100 transition-colors">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t bg-gray-50/50 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 px-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  onClick={handleProfileClick}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 p-1">
                      <User className="h-5 w-5" />
                    </div>
                    <span>Profile Settings</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 p-1">
                      <LogOut className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-red-600">Sign Out</span>
                  </div>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
