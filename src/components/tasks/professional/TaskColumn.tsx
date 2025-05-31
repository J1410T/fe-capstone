import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "@/types/task";
import { Clock, PlayCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const getColumnConfig = (status: TaskStatus) => {
  switch (status) {
    case "To Do":
      return {
        icon: Clock,
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        headerColor: "bg-slate-100",
        textColor: "text-slate-700",
        badgeColor: "bg-slate-200 text-slate-700",
      };
    case "In Progress":
      return {
        icon: PlayCircle,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        headerColor: "bg-blue-100",
        textColor: "text-blue-700",
        badgeColor: "bg-blue-200 text-blue-700",
      };
    case "Completed":
      return {
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        headerColor: "bg-green-100",
        textColor: "text-green-700",
        badgeColor: "bg-green-200 text-green-700",
      };
    case "Overdue":
      return {
        icon: AlertTriangle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        headerColor: "bg-red-100",
        textColor: "text-red-700",
        badgeColor: "bg-red-200 text-red-700",
      };
    default:
      return {
        icon: Clock,
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        headerColor: "bg-slate-100",
        textColor: "text-slate-700",
        badgeColor: "bg-slate-200 text-slate-700",
      };
  }
};

export const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  tasks,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = getColumnConfig(status);
  const Icon = config.icon;
  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-2 ${config.borderColor} ${
        config.bgColor
      } ${isOver ? "ring-2 ring-blue-400 ring-opacity-50" : ""} kanban-column`}
    >
      {/* Column Header */}
      <div
        className={`${config.headerColor} px-3 sm:px-4 py-2 sm:py-3 rounded-t-lg border-b ${config.borderColor} flex-shrink-0`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            <Icon
              className={`w-3 h-3 sm:w-4 sm:h-4 ${config.textColor} flex-shrink-0`}
            />
            <h3
              className={`font-semibold text-xs sm:text-sm ${config.textColor} truncate`}
            >
              {status}
            </h3>
          </div>
          <span
            className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${config.badgeColor} flex-shrink-0 ml-1`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="p-2 sm:p-3 min-h-[120px] sm:min-h-[150px] flex-1">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-slate-400">
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 opacity-50" />
              <p className="text-xs sm:text-sm text-center">
                No {status.toLowerCase()} tasks
                <br />
                <span className="text-xs">Drag tasks here</span>
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
