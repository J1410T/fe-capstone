import React from "react";
import {
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
} from "@/components/ui";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { Task } from "../../shared/types";
import { formatDate } from "../../shared/utils";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface TaskCardProps {
  task: Task;
  milestoneId: string;
  onEdit: (task: Task, milestoneId: string) => void;
  onDelete: (milestoneId: string, taskId: string) => void;
  onStatusChange: (
    milestoneId: string,
    taskId: string,
    status: Task["status"]
  ) => void;
  isLoading: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  milestoneId,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading,
}) => {
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

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(task.status)}
              <h5 className="font-medium text-gray-900">{task.title}</h5>
              <Badge
                variant="outline"
                className={getPriorityColor(task.priority)}
              >
                {task.priority}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-3">{task.description}</p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {task.assignedTo && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{task.assignedTo}</span>
                </div>
              )}
              <div>Due: {formatDate(task.dueDate)}</div>
              {task.completedAt && (
                <div>Completed: {formatDate(task.completedAt)}</div>
              )}
            </div>

            {task.evaluation && (
              <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-l-blue-400">
                <p className="text-sm text-blue-800">
                  <strong>Evaluation:</strong> {task.evaluation}
                </p>
                {task.evaluatedBy && (
                  <p className="text-xs text-blue-600 mt-1">
                    Evaluated by: {task.evaluatedBy}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            {/* Status Change */}
            <Select
              value={task.status}
              onValueChange={(value: Task["status"]) =>
                onStatusChange(milestoneId, task.id, value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task, milestoneId)}
                disabled={isLoading}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <ConfirmDialog
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={() => onDelete(milestoneId, task.id)}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
