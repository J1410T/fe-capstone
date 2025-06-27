import React from "react";
import { Badge, Card, CardContent } from "@/components/ui";
import { CheckCircle, Clock, AlertTriangle, User } from "lucide-react";
import { Task } from "../../shared/types";
import { formatDate } from "../../shared/utils";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "Overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "To Do":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <Card className="relative border-l-4 border-l-blue-500 shadow-sm">
      <CardContent className="px-6 py-4">
        <div className="flex justify-between gap-4">
          {/* LEFT: Task content */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(task.status)}
              <h5 className="font-semibold text-base text-gray-900">
                {task.title}
              </h5>
              <Badge
                variant="outline"
                className={`${getPriorityColor(task.priority)} text-sm`}
              >
                {task.priority}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-sm">
                  Overdue
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-600">
              Due: {formatDate(task.dueDate)}
            </p>
            {task.assignedTo && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>{task.assignedTo}</span>
              </div>
            )}
          </div>

          {/* RIGHT: Status Badge */}
          <div className="flex flex-col items-end justify-start gap-2 min-w-[8rem]">
            <Badge
              variant="outline"
              className={`${getStatusColor(task.status)} text-sm`}
            >
              {task.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
