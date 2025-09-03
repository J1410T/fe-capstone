import React from "react";
import {
  useSignalRConnection,
  useSignalRNotifications,
} from "@/contexts/SignalRContext";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Component to display SignalR connection status and handle real-time notifications
 * This is an example of how to use the SignalR integration
 */
export const SignalRStatus: React.FC = () => {
  const { connectionState, isConnected } = useSignalRConnection();
  const queryClient = useQueryClient();

  // Listen for real-time notifications
  useSignalRNotifications((message) => {
    console.log("🔔 SignalRStatus received real-time notification:", message);

    // Add a small delay to ensure backend processing is complete
    setTimeout(() => {
      // Automatically refresh notification queries when receiving real-time updates
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    }, 150);
  });

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "destructive"}>
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </Badge>
      {connectionState.error && (
        <span className="text-xs text-red-500" title={connectionState.error}>
          Error
        </span>
      )}
    </div>
  );
};
