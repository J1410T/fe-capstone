// Notification types and interfaces

export interface NotificationRequest {
  title: string;
  type:
    | "project"
    | "appraisalcouncil"
    | "transaction"
    | "individualevaluation"
    | "evaluationstage"
    | "evaluation"
    | "userrole"
    | "document"
    | "membertask"
    | "task"
    | "systemconfiguration";
  status: "pending" | "created";
  "objec-notification-id": string;
  "list-account-id"?: string[];
  "is-global-send"?: boolean;
}

export interface NotificationResponse {
  id: string;
}

export interface SendNotificationRequest {
  "list-account-id": string[];
  "notification-id": string;
}

export interface SendNotificationResponse {
  success: boolean;
}

export interface NotificationListRequest {
  // email: string;
  "page-index": number;
  "page-size": number;
  "is-read"?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  type: string;
  "create-date": string;
  "type-object-id": string | null;
  "account-id": string;
  "is-read": boolean;
  "is-global-send": boolean;
  status: "pending" | "approved" | "rejected" | "created";
}

export interface NotificationListResponse {
  "page-index": number;
  "page-size": number;
  "total-count": number;
  "total-page": number;
  "data-list": NotificationItem[];
}

export interface MarkNotificationRequest {
  notification?: string; // notification ID for single notification, empty for mark all
}

export interface MarkNotificationResponse {
  message: string;
}

// SignalR types
export interface SignalRNotificationMessage {
  id: string;
  title: string;
  type: string;
  "create-date": string;
  "account-id": string;
  "is-read": boolean;
  "is-global-send": boolean;
  status: "pending" | "approved" | "rejected" | "created";
  "objec-notification-id": string;
}

export interface SignalRConnectionState {
  isConnected: boolean;
  connectionId?: string;
  error?: string;
}

// User role status for tracking invitation status
export type UserRoleStatus = "pending" | "approved" | "rejected" | "none";

export interface UserRoleStatusUpdate {
  accountId: string;
  projectId: string;
  status: UserRoleStatus;
}

// Extended member interface with invitation status
export interface MemberWithInvitationStatus {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Researcher" | "Secretary" | "Leader";
  isInvitation: boolean;
  invitationStatus: UserRoleStatus;
  notificationId?: string;
}
