import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bell,
  BellRing,
  CheckCircle,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useNotificationList,
  useUpdateUserRoleStatus,
} from "@/hooks/queries/notification";

const ViewAllNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage] = useState(1);
  const [processingNotifications, setProcessingNotifications] = useState<
    Set<string>
  >(new Set());

  // API hooks for notifications
  const { data: allNotificationsData, refetch: refetchAll } =
    useNotificationList(
      currentPage,
      10,
      undefined // Don't filter by read status for "all" tab
    );

  const { data: readNotificationsData, refetch: refetchRead } =
    useNotificationList(
      currentPage,
      10,
      true // Only read notifications for "read" tab
    );

  // Mutation for updating user role status
  const updateUserRoleStatusMutation = useUpdateUserRoleStatus();

  const handleBack = () => navigate(-1);

  const markAllAsRead = () => {
    // TODO: Implement mark all as read API call
    console.log("Mark all as read functionality not implemented yet");
  };

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

  // Get current notifications based on active tab
  const currentNotifications =
    activeTab === "all"
      ? allNotificationsData?.["data-list"] || []
      : readNotificationsData?.["data-list"] || [];

  const unreadCount =
    allNotificationsData?.["data-list"]?.filter((n) => !n["is-read"]).length ||
    0;

  const handleApprove = async (
    notificationId: string,
    typeObjectId: string | null,
    accountId: string
  ) => {
    if (!typeObjectId || !accountId) return;

    setProcessingNotifications((prev) => new Set(prev).add(notificationId));

    try {
      // First get the user role to get the role details
      // Note: We need to call the server function directly since we can't use hooks in async functions
      const { getUserRoleByFilter } = await import("@/services/resources/auth");
      const userRoleResponse = await getUserRoleByFilter({
        "account-id": accountId,
        "project-id": typeObjectId,
        status: "pending",
        "page-index": 1,
        "page-size": 10,
      });

      if (userRoleResponse["data-list"].length > 0) {
        const userRole = userRoleResponse["data-list"][0];

        // Update user role status to approved
        await updateUserRoleStatusMutation.mutateAsync({
          userRoleId: userRole.id,
          status: "approved",
          request: {
            "account-id": userRole["account-id"],
            "role-id": userRole["role-id"],
            "project-id": userRole["project-id"],
          },
        });

        toast.success("User role approved successfully");

        // Refetch notifications
        refetchAll();
        refetchRead();
      }
    } catch (error) {
      console.error("Failed to approve user role:", error);
      toast.error("Failed to approve user role");
    } finally {
      setProcessingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleReject = async (
    notificationId: string,
    typeObjectId: string | null,
    accountId: string
  ) => {
    if (!typeObjectId || !accountId) return;

    setProcessingNotifications((prev) => new Set(prev).add(notificationId));

    try {
      // First get the user role to get the role details
      // Note: We need to call the server function directly since we can't use hooks in async functions
      const { getUserRoleByFilter } = await import("@/services/resources/auth");
      const userRoleResponse = await getUserRoleByFilter({
        "account-id": accountId,
        "project-id": typeObjectId,
        status: "pending",
        "page-index": 1,
        "page-size": 10,
      });

      if (userRoleResponse["data-list"].length > 0) {
        const userRole = userRoleResponse["data-list"][0];

        // Update user role status to rejected
        await updateUserRoleStatusMutation.mutateAsync({
          userRoleId: userRole.id,
          status: "rejected",
          request: {
            "account-id": userRole["account-id"],
            "role-id": userRole["role-id"],
            "project-id": userRole["project-id"],
          },
        });

        toast.success("User role rejected successfully");

        // Refetch notifications
        refetchAll();
        refetchRead();
      }
    } catch (error) {
      console.error("Failed to reject user role:", error);
      toast.error("Failed to reject user role");
    } finally {
      setProcessingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const renderNotificationList = (
    list: Array<{
      id: string;
      title: string;
      type: string;
      "create-date": string;
      "type-object-id": string | null;
      "account-id": string;
      "is-read": boolean;
      "is-global-send": boolean;
      status: "pending" | "approved" | "rejected";
    }>
  ) =>
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
          const isProcessing = processingNotifications.has(n.id);
          return (
            <Card
              key={n.id}
              className={`group border-0 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                n["is-read"]
                  ? "bg-white/90 backdrop-blur-sm"
                  : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-l-4 border-l-blue-500"
              }`}
            >
              <CardContent className="flex gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${getNotificationTypeColor(
                    n.type
                  )}`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {n.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(n["create-date"]).toLocaleDateString()}
                        </span>
                        {!n["is-read"] && (
                          <div className="flex items-center gap-1 ml-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-blue-600 font-medium">
                              New
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {n.status === "pending" && n.type === "project" && (
                    <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(
                            n.id,
                            n["type-object-id"],
                            n["account-id"]
                          );
                        }}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(
                            n.id,
                            n["type-object-id"],
                            n["account-id"]
                          );
                        }}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <X className="w-4 h-4 mr-1" />
                        )}
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
              {renderNotificationList(currentNotifications)}
            </TabsContent>
            <TabsContent value="read" className="p-4 pt-4">
              {renderNotificationList(currentNotifications)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewAllNotifications;
