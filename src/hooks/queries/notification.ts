import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  sendNotificationToUsers,
  getNotificationList,
  markNotification,
} from "@/services/resources/notification";
import {
  NotificationRequest,
  SendNotificationRequest,
  NotificationListRequest,
  MarkNotificationRequest,
} from "@/types/notification";

import { getAuthResponse } from "@/utils/cookie-manager";
import { AuthResponse } from "@/types/auth";

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
 * Hook to send notification to users
 */
export function useSendNotification() {
  return useMutation({
    mutationFn: (request: SendNotificationRequest) =>
      sendNotificationToUsers(request),
    onError: (error) => {
      console.error("Failed to send notification:", error);
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
  const authResponse = getAuthResponse<AuthResponse>();
  const email = authResponse?.email;

  return useQuery({
    queryKey: ["notifications", email, pageIndex, pageSize, isRead],
    queryFn: () => {
      if (!email) {
        throw new Error("No email found in auth response");
      }
      const request: NotificationListRequest = {
        email,
        "page-index": pageIndex,
        "page-size": pageSize,
      };

      if (isRead !== undefined) {
        request["is-read"] = isRead;
      }

      return getNotificationList(request);
    },
    enabled: !!email,
    // staleTime: 60000, // Cache for 60 seconds for real-time updates
    // refetchInterval: 60000, // Refetch every 15 seconds for real-time updates
    refetchIntervalInBackground: true, // Continue refetching in background
  });
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

/**
 * Hook to create and send invitation notification
 */
export function useInviteMember() {
  const createNotificationMutation = useCreateNotification();
  const sendNotificationMutation = useSendNotification();

  return useMutation({
    mutationFn: async ({
      projectId,
      accountId,
    }: {
      projectId: string;
      accountId: string;
    }) => {
      // Step 1: Create notification
      const notificationRequest: NotificationRequest = {
        title: "Invite Enroll to project",
        type: "project",
        status: "pending",
        "objec-notification-id": projectId,
      };
      const notificationResponse = await createNotificationMutation.mutateAsync(
        notificationRequest
      );

      // Step 2: Send notification to user
      const sendRequest: SendNotificationRequest = {
        "list-account-id": [accountId],
        "notification-id": notificationResponse.id,
      };

      await sendNotificationMutation.mutateAsync(sendRequest);

      return {
        notificationId: notificationResponse.id,
        success: true,
      };
    },
    onError: (error) => {
      console.error("Failed to invite member:", error);
    },
  });
}
