import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Milestone } from "../../shared/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "../../shared/utils";
import { TaskCard } from "./TaskCard";

interface MilestoneCardProps {
  milestone: Milestone;
  onAddTask?: (milestoneId: string) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
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
      className="border rounded-lg border-gray-200 mb-2"
    >
      <AccordionTrigger className="px-3 py-2 hover:bg-gray-50 data-[state=open]:border-b-0">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-start gap-2 flex-1">
            {getStatusIcon(milestone.status)}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm text-gray-900">
                  {milestone.name}
                </h3>
                <StatusBadge status={milestone.status} />
              </div>
              {milestone.description && (
                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                  {milestone.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(milestone["start-date"])} →{" "}
                  {formatDate(milestone["end-date"])}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {milestone.tasks.length} tasks
                </span>
              </div>
            </div>
          </div>
          {milestone.tasks.length > 0 && (
            <div className="text-right text-xs text-gray-700">
              <div className="text-[10px] text-gray-500">Progress</div>
              <div className="font-semibold">
                {Math.round(
                  (milestone.tasks.filter((t) => t.status === "Completed")
                    .length /
                    milestone.tasks.length) *
                    100
                )}
                %
              </div>
            </div>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-3 pb-2 pt-0">
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-800 mb-1">
            Tasks ({milestone.tasks.length})
          </h4>

          {milestone.tasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-xs">
              <Clock className="w-4 h-4 mx-auto mb-1 opacity-50" />
              <p>No tasks available for this milestone.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {milestone.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
