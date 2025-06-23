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
  LogOut,
  Home,
  LayoutDashboard,
  FolderOpen,
  Calendar,
  CheckSquare,
  BellRing,
  Clock,
  MessageSquare,
  AlertTriangle,
  X,
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

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: "Project Update Required",
    message: "Your quarterly report for ML Research Project is due in 3 days.",
    type: "reminder" as const,
    time: "2 hours ago",
    read: false,
    icon: FileText,
  },
  {
    id: 2,
    title: "New Team Member Added",
    message: "Sarah Johnson has been added to your Engineering Project team.",
    type: "info" as const,
    time: "4 hours ago",
    read: false,
    icon: User,
  },
  {
    id: 3,
    title: "Meeting Scheduled",
    message: "Project review meeting scheduled for tomorrow at 2:00 PM.",
    type: "meeting" as const,
    time: "6 hours ago",
    read: true,
    icon: Calendar,
  },
  {
    id: 4,
    title: "Task Completed",
    message: "Data analysis task has been marked as completed by John Doe.",
    type: "success" as const,
    time: "1 day ago",
    read: true,
    icon: CheckCircle,
  },
  {
    id: 5,
    title: "Budget Alert",
    message: "Project budget has reached 80% utilization threshold.",
    type: "warning" as const,
    time: "2 days ago",
    read: false,
    icon: AlertTriangle,
  },
];

// Define menu items for each role
const menuItemsByRole = {
  [UserRole.MEMBER]: [
    { name: "Home", path: "/home", icon: Home },
    { name: "Dashboard", path: "/member/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/member/projects", icon: FolderOpen },
    { name: "Tasks", path: "/member/tasks", icon: ClipboardList },
    { name: "Milestones", path: "/member/milestones", icon: ClipboardList },
    { name: "My Projects", path: "/member/my-projects", icon: Briefcase },
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
    { name: "Dashboard", path: "/pi/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/pi/projects", icon: FolderOpen },
    { name: "My Projects", path: "/pi/my-projects", icon: Briefcase },
    { name: "Meetings", path: "/pi/meetings", icon: Calendar },
    // { name: "Progress", path: "/pi/progress-reports", icon: FileText },
  ],
  [UserRole.APPRAISAL_COUNCIL]: [
    { name: "Home", path: "/home", icon: Home },
    {
      name: "Project Approval",
      path: "/council/project-approval",
      icon: CheckCircle,
    },
    { name: "Evaluations", path: "/council/evaluations", icon: FileText },
    { name: "Meetings", path: "/council/meetings", icon: Calendar },
    { name: "Approvals", path: "/council/approvals", icon: CheckSquare },
  ],
  [UserRole.STAFF]: [
    { name: "Home", path: "/home", icon: Home },
    { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Tasks", path: "/tasks", icon: ClipboardList },
  ],
};

function FlexibleHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Get menu items based on user role
  const menuItems = user?.role
    ? menuItemsByRole[user.role]
    : menuItemsByRole[UserRole.MEMBER];

  const handleProfileClick = () => {
    // Navigate to role-specific profile page
    if (user?.role === "Principal Investigator") {
      navigate("/pi/profile");
    } else if (user?.role === "Member") {
      navigate("/member/profile");
    } else if (user?.role === "Host Institution") {
      navigate("/host/profile");
    } else if (user?.role === "Appraisal council") {
      navigate("/council/profile");
    } else if (user?.role === "Staff") {
      navigate("/staff/profile");
    } else {
      // Fallback to member profile for unknown roles
      navigate("/member/profile");
    }
    setIsOpen(false);
  };

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-20 h-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Left: Logo + Menu */}
        <div className="flex items-center space-x-10 h-full">
          {/* Logo */}
          <Link to="/home" className="logo-container">
            <img
              src="/images/pg-logo-green.png"
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
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="flex items-center justify-between py-3">
                <span className="font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-auto p-1 text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <BellRing className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-0 focus:bg-gray-50"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div
                          className={`w-full p-3 ${
                            !notification.read ? "bg-blue-50/50" : ""
                          } hover:bg-gray-50 transition-colors`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full ${getNotificationTypeColor(
                                notification.type
                              )}`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`text-sm font-medium text-gray-900 ${
                                    !notification.read ? "font-semibold" : ""
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="h-auto p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {notification.time}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
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
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 text-center text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View all notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <RoleSwitcher />
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
                    src="/images/pg-logo-green.png"
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

            {/* Notifications - Mobile */}
            <div className="border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {notifications.slice(0, 3).map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        !notification.read
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`p-1 rounded-full ${getNotificationTypeColor(
                            notification.type
                          )}`}
                        >
                          <IconComponent className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm ${
                              !notification.read
                                ? "font-semibold"
                                : "font-medium"
                            } text-gray-900`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {notifications.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    View all {notifications.length} notifications
                  </Button>
                )}
              </div>
            </div>

            {/* Role Switcher - Mobile */}
            <div className="border-b border-gray-200 pb-3 mb-3">
              <RoleSwitcher
                variant="mobile"
                onRoleChange={() => setIsOpen(false)}
              />
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
                  onClick={handleProfileClick}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
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
