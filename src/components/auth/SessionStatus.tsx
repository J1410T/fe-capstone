/**
 * Session Status Component
 * Displays session activity status and auto-logout countdown
 */

import React, { useState, useCallback } from "react";
import { AlertTriangle, Clock, Eye, EyeOff } from "lucide-react";
import { useSessionActivity } from "@/hooks/useSessionActivity";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SessionStatusProps {
  /**
   * Whether to show the session status
   * @default true
   */
  show?: boolean;

  /**
   * Position of the status indicator
   * @default "bottom-right"
   */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";

  /**
   * Whether to show detailed information
   * @default false
   */
  showDetails?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;
}

export const SessionStatus: React.FC<SessionStatusProps> = ({
  show = true,
  position = "bottom-right",
  showDetails = false,
  className = "",
}) => {
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInactive = useCallback(() => {
    console.log("User became inactive - triggering logout");
    logout();
  }, [logout]);

  const handleActive = useCallback(() => {
    console.log("User became active");
  }, []);

  const {
    isActive,
    lastActivity,
    isTabVisible,
    timeUntilLogout,
    resetActivity,
    getFormattedTimeUntilLogout,
  } = useSessionActivity({
    enabled: show,
    onInactive: handleInactive,
    onActive: handleActive,
  });

  if (!show) return null;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const showWarning = timeUntilLogout !== null && timeUntilLogout <= 300; // Show warning in last 5 minutes
  const showCritical = timeUntilLogout !== null && timeUntilLogout <= 60; // Show critical in last minute

  const getStatusColor = () => {
    if (!isActive) return "destructive";
    if (showCritical) return "destructive";
    if (showWarning) return "warning";
    return "default";
  };

  const getStatusText = () => {
    if (!isActive) return "Inactive";
    if (timeUntilLogout) return "Active";
    return "Active";
  };

  const formatLastActivity = () => {
    if (!lastActivity) return "Unknown";
    const now = new Date();
    const diff = now.getTime() - lastActivity.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      <TooltipProvider>
        <div className="space-y-2">
          {/* Warning Alert for Impending Logout */}
          {showWarning && timeUntilLogout && (
            <Alert
              className={`w-80 ${
                showCritical
                  ? "border-red-500 bg-red-50"
                  : "border-yellow-500 bg-yellow-50"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  showCritical ? "text-red-600" : "text-yellow-600"
                }`}
              />
              <AlertDescription
                className={showCritical ? "text-red-800" : "text-yellow-800"}
              >
                <div className="flex items-center justify-between">
                  <span>
                    {showCritical
                      ? "Session expiring soon!"
                      : "Session will expire soon"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={showCritical ? "destructive" : "secondary"}>
                      {getFormattedTimeUntilLogout()}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetActivity}
                      className="h-6 px-2 text-xs"
                    >
                      Stay Active
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Session Status Indicator */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 bg-white shadow-md"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-xs font-medium">{getStatusText()}</span>
                  {timeUntilLogout && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {getFormattedTimeUntilLogout()}
                    </Badge>
                  )}
                  {isExpanded ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to {isExpanded ? "hide" : "show"} session details</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Detailed Session Information */}
          {(isExpanded || showDetails) && (
            <div className="bg-white border rounded-lg shadow-lg p-3 w-80 text-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Session Status</span>
                  <Badge
                    variant={
                      getStatusColor() as
                        | "default"
                        | "secondary"
                        | "destructive"
                        | "outline"
                    }
                  >
                    {getStatusText()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tab Visible</span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isTabVisible ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span>{isTabVisible ? "Yes" : "No"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Activity</span>
                  <span>{formatLastActivity()}</span>
                </div>

                {timeUntilLogout && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Auto-logout In</span>
                    <Badge variant={showWarning ? "destructive" : "secondary"}>
                      {getFormattedTimeUntilLogout()}
                    </Badge>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetActivity}
                    className="w-full"
                  >
                    Reset Activity Timer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default SessionStatus;
