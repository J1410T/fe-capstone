import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
  useMarkNotification,
  useSendNotification,
} from "@/hooks/queries/notification";
import {
  useUpdateUserRoleStatus,
  // useUserRoleByAccountAndProject,
} from "@/hooks/queries/useAuth";
// import { useProject } from "@/hooks/queries/project";
import { getUserRoleByFilter } from "@/services/resources/auth";
import { NotificationRequest } from "@/types/notification";

// Component to display project name for project notifications
// const ProjectNotificationTitle: React.FC<{
//   notification: {
//     id: string;
//     title: string;
//     type: string;
//     "type-object-id": string | null;
//   };
// }> = ({ notification }) => {
//   const { data: project } = useProject(notification["type-object-id"] || "");

//   if (notification.type === "project" && project) {
//     return (
//       <div>
//         <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
//           {notification.title}
//         </h4>
//         <p className="text-sm text-blue-600 font-medium">
//           Project:{" "}
//           {project.data?.["project-detail"]?.["english-title"] ||
//             "Unknown Project"}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
//       {notification.title}
//     </h4>
//   );
// };

const ViewAllNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [processingNotifications, setProcessingNotifications] = useState<
    Set<string>
  >(new Set());

  // API hooks for notifications with proper filtering and continuous updates
  const { data: allNotificationsData, refetch: refetchAll } =
    useNotificationList(
      currentPage,
      pageSize,
      undefined // Don't filter by read status for "all" tab
    );

  const { data: readNotificationsData, refetch: refetchRead } =
    useNotificationList(
      currentPage,
      pageSize,
      true // Only read notifications for "read" tab
    );

  const { data: unreadNotificationsData, refetch: refetchUnread } =
    useNotificationList(
      currentPage,
      pageSize,
      false // Only unread notifications for "unread" tab
    );

  // Hook for updating user role status and marking notifications
  const updateUserRoleStatusMutation = useUpdateUserRoleStatus();
  const markNotificationMutation = useMarkNotification();
  const sendNotificationMutation = useSendNotification();

  const handleBack = () => navigate(-1);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const markAllAsRead = async () => {
    try {
      await markNotificationMutation.mutateAsync({});
      // Refetch all notification lists
      refetchAll();
      refetchRead();
      refetchUnread();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
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
      : activeTab === "read"
      ? readNotificationsData?.["data-list"] || []
      : unreadNotificationsData?.["data-list"] || [];

  // Get pagination info based on active tab
  const currentData =
    activeTab === "all"
      ? allNotificationsData
      : activeTab === "read"
      ? readNotificationsData
      : unreadNotificationsData;

  const totalPages = currentData?.["total-page"] || 1;
  const totalCount = currentData?.["total-count"] || 0;

  const unreadCount =
    allNotificationsData?.["data-list"]?.filter((n) => !n["is-read"]).length ||
    0;

  const unreadTabCount = unreadNotificationsData?.["total-count"] || 0;

  const handleApprove = async (
    notificationId: string,
    typeObjectId: string | null,
    accountId: string
  ) => {
    if (!typeObjectId || !accountId) return;

    setProcessingNotifications((prev) => new Set(prev).add(notificationId));

    try {
      const userRoleResponse = await getUserRoleByFilter({
        "account-id": accountId,
        "project-id": typeObjectId,
        status: "pending",
        "page-index": 1,
        "page-size": 10,
      });

      const userRoles = userRoleResponse["data-list"];

      if (userRoles.length > 0) {
        // Update status for all UserRoles found
        for (const userRole of userRoles) {
          await updateUserRoleStatusMutation.mutateAsync({
            userRoleId: userRole.id,
            status: "approved",
            request: {
              "account-id": userRole["account-id"],
              "role-id": userRole["role-id"],
              "project-id": userRole["project-id"],
            },
          });
        }

        const notificationRequest: NotificationRequest = {
          title: `Please submit your Science CV in Project Detail `,
          type: "project",
          status: "create",
          "objec-notification-id": typeObjectId,
          "list-account-id": [accountId],
        };

        await sendNotificationMutation.mutateAsync(notificationRequest);

        toast.success(`${userRoles.length} user role(s) approved successfully`);

        // Mark notification as read
        await markNotificationMutation.mutateAsync({
          notification: notificationId,
        });

        // Refetch notifications
        refetchAll();
        refetchRead();
        refetchUnread();
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
      const userRoleResponse = await getUserRoleByFilter({
        "account-id": accountId,
        "project-id": typeObjectId,
        status: "pending",
        "page-index": 1,
        "page-size": 10,
      });

      const userRoles = userRoleResponse["data-list"];

      if (userRoles.length > 0) {
        // Update status for all UserRoles found
        for (const userRole of userRoles) {
          await updateUserRoleStatusMutation.mutateAsync({
            userRoleId: userRole.id,
            status: "rejected",
            request: {
              "account-id": userRole["account-id"],
              "role-id": userRole["role-id"],
              "project-id": userRole["project-id"],
            },
          });
        }

        toast.success(`${userRoles.length} user role(s) rejected successfully`);

        // Mark notification as read
        await markNotificationMutation.mutateAsync({
          notification: notificationId,
        });

        // Refetch notifications
        refetchAll();
        refetchRead();
        refetchUnread();
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
      status: "pending" | "approved" | "rejected" | "create";
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
                      <h4>{n.title}</h4>
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
                    {/* Read button for 'create' status notifications */}
                    {n.status === "create" && !n["is-read"] && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-xl px-3 py-1"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await markNotificationMutation.mutateAsync({
                              notification: n.id,
                            });
                            // Refetch all notification lists
                            refetchAll();
                            refetchRead();
                            refetchUnread();
                          } catch (error) {
                            console.error(
                              "Failed to mark notification as read:",
                              error
                            );
                          }
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    )}
                  </div>

                  {n.status === "pending" && n.type === "project" && (
                    <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100">
                      <Button
                        size="sm"
                        disabled={isProcessing || n["is-read"]}
                        className={`${
                          n["is-read"]
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg"
                        } transition-all duration-200 rounded-xl px-4 py-2 disabled:opacity-50`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!n["is-read"]) {
                            handleApprove(
                              n.id,
                              n["type-object-id"],
                              n["account-id"]
                            );
                          }
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
                        disabled={isProcessing || n["is-read"]}
                        className={`${
                          n["is-read"]
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg"
                        } transition-all duration-200 rounded-xl px-4 py-2 disabled:opacity-50`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!n["is-read"]) {
                            handleReject(
                              n.id,
                              n["type-object-id"],
                              n["account-id"]
                            );
                          }
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

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 px-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Items per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            notifications
          </p>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getVisiblePages().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

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
            onValueChange={handleTabChange}
            className="w-full py-0"
          >
            <TabsList className="grid grid-cols-3 w-full bg-gray-50/50 rounded-none h-14">
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
                value="unread"
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl mx-2 my-2"
              >
                <BellRing className="w-4 h-4" />
                Unread
                {unreadTabCount > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadTabCount}
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
              {renderPagination()}
            </TabsContent>
            <TabsContent value="unread" className="p-4 pt-4">
              {renderNotificationList(currentNotifications)}
              {renderPagination()}
            </TabsContent>
            <TabsContent value="read" className="p-4 pt-4">
              {renderNotificationList(currentNotifications)}
              {renderPagination()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewAllNotifications;
