import React from "react";
import { Badge } from "@/components/ui";
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
    <div className="relative border border-gray-200 rounded-md bg-white shadow-sm">
      <div className="px-3 py-2">
        <div className="flex justify-between items-start gap-2">
          {/* LEFT: Task content */}
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              {getStatusIcon(task.status)}
              <h5 className="font-medium text-xs text-gray-900 truncate">
                {task.title}
              </h5>
              <Badge
                variant="outline"
                className={`${getPriorityColor(
                  task.priority
                )} text-[10px] px-1 py-0`}
              >
                {task.priority}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-[10px] px-1 py-0">
                  Overdue
                </Badge>
              )}
            </div>
            {task.description && (
              <p className="text-[10px] text-gray-600 line-clamp-1">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {formatDate(task["start-date"])} →{" "}
                {formatDate(task["end-date"])}
              </span>
              {task["member-tasks"] && (
                <span className="flex items-center gap-0.5">
                  <User className="w-2.5 h-2.5" />
                  {task["member-tasks"]}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Status */}
          <div className="flex-shrink-0">
            <Badge
              variant="outline"
              className={`${getStatusColor(task.status)} text-[10px] px-1 py-0`}
            >
              {task.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
