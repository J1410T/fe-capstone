import {
  NotificationRequest,
  NotificationResponse,
  // SendNotificationRequest,
  // SendNotificationResponse,
  NotificationListRequest,
  NotificationListResponse,
  MarkNotificationRequest,
  MarkNotificationResponse,
} from "@/types/notification";
import { axiosClient, getAccessToken } from "../api";

interface UserRole {
  "account-id": string;
  "full-name"?: string;
  email?: string;
  role?: {
    name?: string;
    id?: string;
  };
  name?: string;
}

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
    console.error("Request payload:", request);
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
      // email: request.email,
      "page-index": request["page-index"],
      "page-size": request["page-size"],
    };

    if (request["is-read"] !== undefined) {
      requestBody["is-read"] = request["is-read"];
    }

    const response = await axiosClient.post<NotificationListResponse>(
      "/notification/user-notification",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    // Handle 404 errors silently - don't log them to console
    const axiosError = error as {
      response?: { status: number };
      status?: number;
    };
    if (axiosError?.response?.status === 404 || axiosError?.status === 404) {
      // Return empty notification list structure for 404 errors
      return {
        "data-list": [],
        "total-count": 0,
        "total-page": 1,
        "page-index": request["page-index"],
        "page-size": request["page-size"],
      };
    }

    // Log and re-throw other errors
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
      ? `/notification/status?notification=${request.notification}`
      : "/notification/status";

    const response = await axiosClient.put<string>(url, null, {
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

/**
 * Get Principal Investigator account ID from project
 */
export const getPIAccountIdByProjectId = async (
  projectId: string
): Promise<string> => {
  try {
    const accessToken = getAccessToken();

    // Get user roles for the project
    const response = await axiosClient.post(
      "/user-role/filter",
      {
        "project-id": projectId,
        "page-index": 1,
        "page-size": 100,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json-patch+json",
        },
      }
    );

    const userRoles = response.data?.["data-list"] || [];

    // Find PI role - try multiple possible role names
    const piRole = userRoles.find((role: UserRole) => {
      const roleName = role.role?.name || role.name || "";
      return roleName === "Principal Investigator" || roleName === "PI";
    });

    if (!piRole) {
      const availableRoles = userRoles
        .map((r: UserRole) => r.role?.name || r.name)
        .filter(Boolean);
      console.error("No PI found. Available roles:", availableRoles);
      throw new Error(
        `No Principal Investigator found for project ${projectId}. Available roles: ${availableRoles.join(
          ", "
        )}`
      );
    }

    console.log("Found PI:", {
      accountId: piRole["account-id"],
      roleName: piRole.role?.name || piRole.name,
      fullName: piRole["full-name"],
    });

    return piRole["account-id"];
  } catch (error) {
    console.error("getPIAccountIdByProjectId error:", error);
    throw error;
  }
};

/**
 * Send document to Principal Investigator (with fallback to all project members)
 */
export const sendDocumentToPI = async (
  documentId: string,
  projectId: string
): Promise<NotificationResponse> => {
  try {
    // Try to get PI account ID from project
    let piAccountId: string | null = null;
    let fallbackToAllMembers = false;

    try {
      piAccountId = await getPIAccountIdByProjectId(projectId);
    } catch (piError) {
      console.warn(
        "Could not find specific PI, falling back to all project members:",
        piError
      );
      fallbackToAllMembers = true;
    }

    let accountIds: string[] = [];

    if (fallbackToAllMembers) {
      // Fallback: Get all project members
      try {
        const accessToken = getAccessToken();
        const response = await axiosClient.post(
          "/user-role/filter",
          {
            "project-id": projectId,
            "page-index": 1,
            "page-size": 100,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json-patch+json",
            },
          }
        );

        const userRoles = response.data?.["data-list"] || [];
        accountIds = userRoles
          .map((role: UserRole) => role["account-id"])
          .filter((id: string) => id);
      } catch (fallbackError) {
        throw new Error(
          `Could not find PI and failed to get project members: ${fallbackError}`
        );
      }
    } else {
      accountIds = piAccountId ? [piAccountId] : [];
    }

    if (accountIds.length === 0) {
      throw new Error(`No recipients found for project ${projectId}`);
    }

    // Create notification
    const notificationRequest: NotificationRequest = {
      title: fallbackToAllMembers ? "" : "Tài liệu mới cần xem xét",
      type: "project",
      status: "pending",
      "objec-notification-id": documentId,
      "list-account-id": accountIds,
    };

    const notificationResponse = await createNotification(notificationRequest);

    console.log("Document sent successfully:", {
      documentId,
      projectId,
      recipientType: fallbackToAllMembers ? "all_members" : "pi_only",
      recipientCount: accountIds.length,
      notificationId: notificationResponse.id,
    });

    return notificationResponse;
  } catch (error) {
    console.error("sendDocumentToPI error:", error);
    throw error;
  }
};
