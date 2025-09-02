import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  // sendNotificationToUsers,
  getNotificationList,
  markNotification,
} from "@/services/resources/notification";
import {
  NotificationRequest,
  // SendNotificationRequest,
  NotificationListRequest,
  MarkNotificationRequest,
  NotificationListResponse,
} from "@/types/notification";

import { useSignalR } from "../useSignalR";
import { useEffect } from "react";

/**
 * Hook to create a notification
 */
export function useCreateNotification() {
  return useMutation({
    mutationFn: (request: NotificationRequest) => createNotification(request),
    onError: (error) => {
      console.error("Failed to create notification:", error);
    },
  });
}

/**
 * Hook to get notification list for current user
 */
export function useNotificationList(
  pageIndex: number = 1,
  pageSize: number = 10,
  isRead?: boolean
) {
  const queryClient = useQueryClient();
  const { notifications: realtimeNotifications, clearNotifications } =
    useSignalR();

  const query = useQuery({
    queryKey: ["notifications", pageIndex, pageSize, isRead],
    queryFn: () => {
      const request: NotificationListRequest = {
        "page-index": pageIndex,
        "page-size": pageSize,
      };

      if (isRead !== undefined) {
        request["is-read"] = isRead;
      }

      return getNotificationList(request);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - longer since we have real-time updates
    refetchOnWindowFocus: false, // Disable since we have real-time updates
  });

  // Update query data when receiving real-time notifications
  useEffect(() => {
    if (realtimeNotifications.length > 0) {
      queryClient.setQueryData(
        ["notifications", pageIndex, pageSize, isRead],
        (notificationData: NotificationListResponse | undefined) => {
          if (!notificationData) return notificationData;

          // Convert real-time notifications to the format expected by the UI
          const newNotifications = realtimeNotifications.map(
            (notification) => ({
              id: notification.Id,
              title: notification.Title,
              type: notification.Type,
              createDate: notification.CreateDate,
              objectId: notification.ObjectId,
              isGlobal: notification.IsGlobal,
              isRead: false, // New notifications are unread
            })
          );

          return {
            ...notificationData,
            "data-list": [
              ...newNotifications,
              ...notificationData["data-list"],
            ],
            "total-count":
              notificationData["total-count"] + newNotifications.length,
          };
        }
      );

      // Clear processed notifications
      clearNotifications();
    }
  }, [
    realtimeNotifications,
    queryClient,
    pageIndex,
    pageSize,
    isRead,
    clearNotifications,
  ]);

  return query;
}

/**
 * Hook to mark notification(s) as read
 */
export function useMarkNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MarkNotificationRequest = {}) =>
      markNotification(request),
    onSuccess: () => {
      // Invalidate all notification queries to refresh data immediately
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Also refetch all notification queries to ensure immediate updates across all tabs
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Failed to mark notification:", error);
    },
  });
}

// Hook chung để gửi notification
export function useSendNotification() {
  const createNotificationMutation = useCreateNotification();

  return useMutation({
    mutationFn: async (request: NotificationRequest) => {
      const notificationResponse = await createNotificationMutation.mutateAsync(
        request
      );

      return {
        notificationId: notificationResponse.id,
        success: true,
      };
    },
    onError: (error) => {
      console.error("Failed to send notification:", error);
    },
  });
}
