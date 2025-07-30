import {
  NotificationRequest,
  NotificationResponse,
  SendNotificationRequest,
  SendNotificationResponse,
  NotificationListRequest,
  NotificationListResponse,
  MarkNotificationRequest,
  MarkNotificationResponse,
} from "@/types/notification";
import { axiosClient, getAccessToken } from "../api";

/**
 * Create a new notification
 */
export const createNotification = async (
  request: NotificationRequest
): Promise<NotificationResponse> => {
  try {
    const accessToken = getAccessToken();

    const response = await axiosClient.post<string>("/notification", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    // API returns notification ID as string
    return { id: response.data };
  } catch (error) {
    console.error("createNotification error:", error);
    throw error;
  }
};

/**
 * Send notification to users
 */
export const sendNotificationToUsers = async (
  request: SendNotificationRequest
): Promise<SendNotificationResponse> => {
  try {
    const accessToken = getAccessToken();

    const response = await axiosClient.post<boolean>(
      "/notification/accounts",
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return { success: response.data };
  } catch (error) {
    console.error("sendNotificationToUsers error:", error);
    throw error;
  }
};

/**
 * Get list of notifications for user
 */
export const getNotificationList = async (
  request: NotificationListRequest
): Promise<NotificationListResponse> => {
  try {
    const accessToken = getAccessToken();

    // Build request body, only include is-read if it's defined
    const requestBody: Record<string, unknown> = {
      email: request.email,
      "page-index": request["page-index"],
      "page-size": request["page-size"],
    };

    if (request["is-read"] !== undefined) {
      requestBody["is-read"] = request["is-read"];
    }

    const response = await axiosClient.post<NotificationListResponse>(
      "/notification/list",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("getNotificationList error:", error);
    throw error;
  }
};

/**
 * Mark notification(s) as read
 */
export const markNotification = async (
  request: MarkNotificationRequest = {}
): Promise<MarkNotificationResponse> => {
  try {
    const accessToken = getAccessToken();

    // Build URL with query parameter if notification ID is provided
    const url = request.notification
      ? `/notification?notification=${request.notification}`
      : "/notification";

    const response = await axiosClient.patch<string>(url, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { message: response.data };
  } catch (error) {
    console.error("markNotification error:", error);
    throw error;
  }
};
