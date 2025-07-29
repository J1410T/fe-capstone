import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bell,
  BellRing,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  User,
  AlertTriangle,
  X,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockNotifications = [
  {
    id: 1,
    title: "Project Update Required",
    message: "Your quarterly report for ML Research Project is due in 3 days.",
    type: "reminder" as const,
    time: "2 hours ago",
    read: false,
    icon: FileText,
    status: "pending",
  },
  {
    id: 2,
    title: "New Team RESEARCHER Added",
    message: "Sarah Johnson has been added to your Engineering Project team.",
    type: "info" as const,
    time: "4 hours ago",
    read: false,
    icon: User,
    status: "created",
  },
  {
    id: 3,
    title: "Meeting Scheduled",
    message: "Project review meeting scheduled for tomorrow at 2:00 PM.",
    type: "meeting" as const,
    time: "6 hours ago",
    read: true,
    icon: Calendar,
    status: "created",
  },
  {
    id: 4,
    title: "Task Completed",
    message: "Data analysis task has been marked as completed by John Doe.",
    type: "success" as const,
    time: "1 day ago",
    read: true,
    icon: CheckCircle,
    status: "pending",
  },
  {
    id: 5,
    title: "Budget Alert",
    message: "Project budget has reached 80% utilization threshold.",
    type: "warning" as const,
    time: "2 days ago",
    read: false,
    status: "created",
    icon: AlertTriangle,
  },
  {
    id: 6,
    title: "Document Approved",
    message:
      "Your research proposal has been approved by the review committee.",
    type: "success" as const,
    time: "3 days ago",
    read: true,
    icon: CheckCircle,
    status: "pending",
  },
  {
    id: 7,
    title: "Deadline Reminder",
    message: "Project milestone deadline is approaching in 5 days.",
    type: "reminder" as const,
    time: "4 days ago",
    read: false,
    icon: Clock,
    status: "pending",
  },
  {
    id: 8,
    title: "New Message",
    message:
      "You have received a new message from Dr. Smith regarding your project.",
    type: "info" as const,
    time: "1 week ago",
    read: true,
    icon: MessageSquare,
    status: "created",
  },
];

const ViewAllNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const handleBack = () => navigate(-1);
  const markAsRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const removeNotification = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "text-white bg-gradient-to-r from-blue-500 to-blue-600";
      case "info":
        return "text-white bg-gradient-to-r from-emerald-500 to-teal-500";
      case "meeting":
        return "text-white bg-gradient-to-r from-purple-500 to-indigo-500";
      case "success":
        return "text-white bg-gradient-to-r from-green-500 to-emerald-500";
      case "warning":
        return "text-white bg-gradient-to-r from-amber-500 to-orange-500";
      default:
        return "text-white bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readNotifications = notifications.filter((n) => n.read);
  const handleApprove = (id: number) => {
    // Gọi API để approve
    // Sau khi approve thành công, cập nhật trạng thái của thông báo
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "approved" } : n))
    );
  };
  const handleReject = (id: number) => {
    // Gọi API để reject
    // Sau khi reject thành công, cập nhật trạng thái của thông báo
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "rejected" } : n))
    );
  };

  const renderNotificationList = (list: typeof notifications) =>
    list.length === 0 ? (
      <div className="text-center py-16 text-gray-400">
        <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <BellRing className="w-10 h-10 opacity-40" />
        </div>
        <p className="text-xl font-semibold text-gray-600 mb-2">
          No notifications
        </p>
        <p className="text-sm text-gray-500">
          {activeTab === "all"
            ? "You're all caught up! 🎉"
            : "No read notifications yet."}
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        {list.map((n) => {
          const Icon = n.icon;
          return (
            <Card
              key={n.id}
              className={`group border-0 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                n.read
                  ? "bg-white/90 backdrop-blur-sm"
                  : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-l-4 border-l-blue-500"
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <CardContent className="flex gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${getNotificationTypeColor(
                    n.type
                  )}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {n.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{n.time}</span>
                        {!n.read && (
                          <div className="flex items-center gap-1 ml-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-blue-600 font-medium">
                              New
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl p-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {n.status === "pending" && (
                    <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(n.id);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(n.id);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm  border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 hover:bg-blue-50 transition-colors rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  Notifications
                </h1>
                <p className="text-gray-600 mt-1 text-md">
                  Stay updated with your latest activities
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 rounded-xl px-6 py-3"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="py-0 bg-white/80 backdrop-blur-sm  border-white/20 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full py-0"
          >
            <TabsList className="grid grid-cols-2 w-full bg-gray-50/50 rounded-none h-14">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl mx-2 my-2"
              >
                <Bell className="w-4 h-4" />
                All Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="read"
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl mx-2 my-2"
              >
                <CheckCircle className="w-4 h-4" />
                Read
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="p-4 pt-4">
              {renderNotificationList(notifications)}
            </TabsContent>
            <TabsContent value="read" className="p-4 pt-4">
              {renderNotificationList(readNotifications)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewAllNotifications;
