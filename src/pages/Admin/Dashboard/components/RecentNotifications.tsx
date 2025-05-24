import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  DollarSign,
  FileText,
  Users,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  time: string;
  type: "approval" | "budget" | "user" | "form";
}

interface RecentNotificationsProps {
  notifications: Notification[];
}

export const RecentNotifications: React.FC<RecentNotificationsProps> = ({ notifications }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
        <CardDescription>Latest system alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-2">
              {notification.type === "approval" && (
                <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
              )}
              {notification.type === "budget" && (
                <DollarSign className="w-4 h-4 mt-0.5 text-emerald-500" />
              )}
              {notification.type === "user" && (
                <Users className="w-4 h-4 mt-0.5 text-blue-500" />
              )}
              {notification.type === "form" && (
                <FileText className="w-4 h-4 mt-0.5 text-purple-500" />
              )}
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
