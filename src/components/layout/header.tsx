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

function Header() {
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
    <header className="w-full border-b border-gray-200/70 bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 h-16 shadow-sm">
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
                    const IconComponent = notification.icon;
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-0 focus:bg-gray-50 cursor-pointer"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div
                          className={`w-full p-4 border-b border-gray-100 last:border-0 ${
                            !notification.read ? "bg-blue-50/30" : ""
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
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 rounded-full transition-all"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {notification.time}
                                </span>
                                {!notification.read && (
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
              {notifications.length > 0 && (
                <>
                  <Separator />
                  <DropdownMenuItem className="p-3 text-center text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium cursor-pointer">
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
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4 bg-gray-50/50 border-b">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold leading-none text-gray-900">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {user?.email || "user@example.com"}
                  </p>
                  <Badge
                    variant="secondary"
                    className="w-fit text-xs font-medium"
                  >
                    {user?.role || "Member"}
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
                  <span>Sign Out</span>
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
                      src={user?.avatar}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-lg">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {user?.name || "User"}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user?.email || "user@example.com"}
                    </div>
                    <Badge
                      variant="secondary"
                      className="mt-1 w-fit text-xs font-medium"
                    >
                      {user?.role || "Member"}
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
                  className="w-full justify-start h-12 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 p-1">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span>Sign Out</span>
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
