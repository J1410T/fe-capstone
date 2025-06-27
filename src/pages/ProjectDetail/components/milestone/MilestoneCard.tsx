import React from "react";
import {
  Button,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import { CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import { Milestone } from "../../shared/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "../../shared/utils";
import { TaskCard } from "./TaskCard";

interface MilestoneCardProps {
  milestone: Milestone;
  onAddTask?: (milestoneId: string) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onAddTask,
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

  return (
    <AccordionItem
      value={milestone.id}
      className="border rounded-lg border-b border-gray-200"
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline border-b border-gray-200 data-[state=open]:border-b-0">
        <div className="flex items-center justify-between w-full mr-4">
          <div className="flex items-center space-x-4">
            {getStatusIcon(milestone.status)}
            <div className="text-left">
              <h3 className="font-semibold text-lg">{milestone.name}</h3>
              <p className="text-sm text-gray-600">{milestone.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                End Date: {formatDate(milestone.deadline)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <StatusBadge status={milestone.status} />
              </div>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-4 border-b border-gray-200 rounded-lg">
        <div className="space-y-4">
          {/* Add Task Button - Only show if onAddTask is provided (PI user) */}
          {onAddTask && (
            <div className="flex justify-end border-b pb-4">
              <Button
                onClick={() => onAddTask(milestone.id)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Tasks ({milestone.tasks.length})
            </h4>
            {milestone.tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>
                  {onAddTask
                    ? "No tasks yet. Click 'Add Task' to create the first task."
                    : "No tasks available for this milestone."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {milestone.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
