import { useEffect, useRef, useState, useCallback } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { getAccessToken } from "@/utils/cookie-manager";
import { env } from "@/config/env";

export interface RealtimeNotification {
  Id: string;
  Title: string;
  Type: string;
  CreateDate: string;
  ObjectId?: string;
  IsGlobal: boolean;
}

export function useSignalR() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>(
    []
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startConnection = useCallback(async () => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.warn("No access token found, cannot connect to SignalR");
        return;
      }

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${env.API_SERVER}/notificationHub`, {
          accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers before starting
      newConnection.on(
        "ReceiveNotification",
        (notification: RealtimeNotification) => {
          console.log("Received notification:", notification);
          setNotifications((prev) => [notification, ...prev]);

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            new Notification(notification.Title, {
              body: `New ${notification.Type} notification`,
              icon: "/notification-icon.png", // Add your app icon
              tag: notification.Id, // Prevent duplicate notifications
            });
          }
        }
      );

      // Handle connection events
      newConnection.onreconnecting(() => {
        console.log("SignalR reconnecting...");
        setIsConnected(false);
      });

      newConnection.onreconnected(() => {
        console.log("SignalR reconnected");
        setIsConnected(true);
      });

      newConnection.onclose(() => {
        console.log("SignalR connection closed");
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(startConnection, 5000);
      });

      await newConnection.start();
      console.log("SignalR Connected");
      setConnection(newConnection);
      setIsConnected(true);
    } catch (error) {
      console.error("SignalR Connection Error:", error);
      // Retry connection after 5 seconds
      reconnectTimeoutRef.current = setTimeout(startConnection, 5000);
    }
  }, []);

  const stopConnection = useCallback(async () => {
    if (connection) {
      await connection.stop();
      setConnection(null);
      setIsConnected(false);
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, [connection]);

  const joinUserGroup = async (userId: string) => {
    if (connection && isConnected) {
      try {
        await connection.invoke("JoinGroup", `user_${userId}`);
        console.log(`Joined user group: user_${userId}`);
      } catch (error) {
        console.error("Error joining user group:", error);
      }
    }
  };

  const leaveUserGroup = async (userId: string) => {
    if (connection && isConnected) {
      try {
        await connection.invoke("LeaveGroup", `user_${userId}`);
        console.log(`Left user group: user_${userId}`);
      } catch (error) {
        console.error("Error leaving user group:", error);
      }
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    startConnection();

    return () => {
      stopConnection();
    };
  }, [startConnection, stopConnection]);

  return {
    connection,
    isConnected,
    notifications,
    startConnection,
    stopConnection,
    joinUserGroup,
    leaveUserGroup,
    clearNotifications,
  };
}
