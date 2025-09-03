import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
} from "@/types/notification";
import { signalRService } from "@/services/signalr";

/**
 * Hook to create a notification
 */
export function useCreateNotification() {
  return useMutation({
    mutationFn: (request: NotificationRequest) => {
      console.log("🔨 Creating notification:", request);
      return createNotification(request);
    },
    onSuccess: (response) => {
      console.log("✅ Notification created successfully:", response);
      // Don't invalidate queries here - let SignalR handle real-time updates
    },
    onError: (error) => {
      console.error("❌ Failed to create notification:", error);
    },
  });
}

/**
 * Hook to send notification to users
 */
// export function useSendNotification() {
//   return useMutation({
//     mutationFn: (request: SendNotificationRequest) =>
//       sendNotificationToUsers(request),
//     onError: (error) => {
//       console.error("Failed to send notification:", error);
//     },
//   });
// }

/**
 * Hook to get notification list for current user with SignalR real-time updates
 */
export function useNotificationList(
  pageIndex: number = 1,
  pageSize: number = 10,
  isRead?: boolean
) {
  const queryClient = useQueryClient();

  // Set up SignalR listener for real-time updates
  useEffect(() => {
    const unsubscribe = signalRService.onNotification((message) => {
      console.log(
        "🔔 Notification list hook received real-time notification:",
        message
      );

      // Add a small delay to ensure the backend has processed the notification
      setTimeout(() => {
        // Invalidate and refetch notification queries when receiving real-time updates
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.refetchQueries({ queryKey: ["notifications"] });
      }, 100);
    });

    // Start SignalR connection if not already connected
    if (!signalRService.isConnected()) {
      signalRService.start().catch((error) => {
        console.error("Failed to start SignalR connection:", error);
      });
    }

    return unsubscribe;
  }, [queryClient]);

  return useQuery({
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
    staleTime: 5000, // Reduce cache time for more frequent updates
    refetchIntervalInBackground: true, // Continue refetching in background
    refetchInterval: 30000, // Auto-refetch every 30 seconds as fallback
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

// export function useInviteMember() {
//   const createNotificationMutation = useCreateNotification();
//   const sendNotificationMutation = useSendNotification();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       accountId,
//     }: {
//       projectId: string;
//       accountId: string;
//     }) => {
//       // Step 1: Create notification
//       const notificationRequest: NotificationRequest = {
//         title: "Invite Enroll to project",
//         type: "project",
//         status: "pending",
//         "objec-notification-id": projectId,
//       };
//       const notificationResponse = await createNotificationMutation.mutateAsync(
//         notificationRequest
//       );

//       // Step 2: Send notification to user
//       const sendRequest: SendNotificationRequest = {
//         "list-account-id": [accountId],
//         "notification-id": notificationResponse.id,
//       };

//       await sendNotificationMutation.mutateAsync(sendRequest);

//       return {
//         notificationId: notificationResponse.id,
//         success: true,
//       };
//     },
//     onError: (error) => {
//       console.error("Failed to invite member:", error);
//     },
//   });
// }

// export function useInviteMember() {
//   const createNotificationMutation = useCreateNotification();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       accountId,
//     }: {
//       projectId: string;
//       accountId: string;
//     }) => {
//       // Create notification with account ID directly in the request
//       const notificationRequest: NotificationRequest = {
//         title: "Invite Enroll to project",
//         type: "project",
//         status: "pending",
//         "objec-notification-id": projectId,
//         "list-account-id": [accountId], // Send to specific account
//       };

//       const notificationResponse = await createNotificationMutation.mutateAsync(
//         notificationRequest
//       );

//       return {
//         notificationId: notificationResponse.id,
//         success: true,
//       };
//     },
//     onError: (error) => {
//       console.error("Failed to invite member:", error);
//     },
//   });
// }

// Hook chung để gửi notification
export function useSendNotification() {
  const createNotificationMutation = useCreateNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: NotificationRequest) => {
      console.log("📤 Sending notification:", request);

      const notificationResponse = await createNotificationMutation.mutateAsync(
        request
      );

      console.log("✅ Notification sent successfully:", notificationResponse);

      return {
        notificationId: notificationResponse.id,
        success: true,
      };
    },
    onSuccess: (data) => {
      console.log("🎯 Notification creation completed:", data);

      // Don't immediately invalidate queries here - let SignalR handle the real-time update
      // The real-time notification will trigger the query invalidation

      // Only invalidate as a fallback after a delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }, 1000);
    },
    onError: (error) => {
      console.error("❌ Failed to send notification:", error);
    },
  });
}
