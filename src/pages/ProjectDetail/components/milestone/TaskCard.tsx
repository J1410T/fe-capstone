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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  User,
  MoreVertical,
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
    <Card className="relative border-l-4 border-l-blue-500 shadow-sm pt-2">
      <CardContent className="px-8 pb-2 relative">
        {/* Nút 3 chấm: góc trên trái */}
        <div className="absolute top-0 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                disabled={isLoading}
              >
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem
                onClick={() => onEdit(task, milestoneId)}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2 text-blue-600" />
                Edit
              </DropdownMenuItem>
              <ConfirmDialog
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={() => onDelete(milestoneId, task.id)}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Nội dung Task + Select */}
        <div className="flex justify-between gap-4 mt-4">
          {/* LEFT: Task content */}
          <div className="flex-1 flex flex-col gap-2 ">
            {" "}
            {/* cách nút trái ra chút */}
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

          {/* RIGHT: Select Status */}
          <div className="flex flex-col items-end justify-start gap-2 min-w-[8rem] mt-6">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
