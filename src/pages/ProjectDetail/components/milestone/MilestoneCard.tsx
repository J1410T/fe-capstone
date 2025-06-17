import React from "react";
import {
  Button,
  Badge,
  Progress,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Milestone, Task } from "../../shared/types";
import { StatusBadge } from "../../shared/components";
import { formatDate } from "../../shared/utils";
import { TaskCard } from "./TaskCard";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestoneId: string) => void;
  onAddTask: (milestoneId: string) => void;
  onEditTask: (task: Task, milestoneId: string) => void;
  onDeleteTask: (milestoneId: string, taskId: string) => void;
  onTaskStatusChange: (
    milestoneId: string,
    taskId: string,
    status: Task["status"]
  ) => void;
  isLoading: boolean;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onEdit,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskStatusChange,
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

  const isOverdue =
    new Date(milestone.deadline) < new Date() &&
    milestone.status !== "Completed";

  return (
    <AccordionItem value={milestone.id} className="border rounded-lg mb-4">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center justify-between w-full mr-4">
          <div className="flex items-center space-x-4">
            {getStatusIcon(milestone.status)}
            <div className="text-left">
              <h3 className="font-semibold text-lg">{milestone.name}</h3>
              <p className="text-sm text-gray-600">{milestone.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <StatusBadge status={milestone.status} />
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Due: {formatDate(milestone.deadline)}
              </p>
            </div>
            <div className="w-32">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{milestone.progress}%</span>
              </div>
              <Progress value={milestone.progress} className="h-2" />
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-4">
        <div className="space-y-4">
          {/* Milestone Actions */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(milestone)}
                disabled={isLoading}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Milestone
              </Button>
              <ConfirmDialog
                title="Delete Milestone"
                description="Are you sure you want to delete this milestone? This action cannot be undone."
                onConfirm={() => onDelete(milestone.id)}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                }
              />
            </div>
            <Button
              onClick={() => onAddTask(milestone.id)}
              size="sm"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Tasks ({milestone.tasks.length})
            </h4>
            {milestone.tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No tasks yet. Add a task to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {milestone.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    milestoneId={milestone.id}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onTaskStatusChange}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
