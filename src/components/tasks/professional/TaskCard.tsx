import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task } from "@/types/task";
import { format, parseISO, isAfter } from "date-fns";
import { Calendar, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "High":
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: "🔴",
      };
    case "Medium":
      return {
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        icon: "🟡",
      };
    case "Low":
      return {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: "🔵",
      };
    default:
      return {
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        icon: "⚪",
      };
  }
};

const isOverdue = (dueDate: string, status: string) => {
  if (status === "Completed") return false;
  return isAfter(new Date(), parseISO(dueDate));
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: sortableIsDragging ? 0.5 : 1,
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
      onClick={() => onClick(task)}
    >
      <div
        className={`
          bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200
          touch-manipulation select-none
          ${
            sortableIsDragging
              ? "shadow-lg ring-2 ring-blue-400 ring-opacity-50 scale-105"
              : ""
          }
          ${overdue ? "ring-1 ring-red-300 bg-red-50" : ""}
        `}
      >
        {/* Priority and Overdue Indicators */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-xs sm:text-sm">{priorityConfig.icon}</span>
            <span className={`text-xs font-medium ${priorityConfig.color}`}>
              {task.priority}
            </span>
          </div>
          {overdue && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-3 h-3" />
              <span className="text-xs font-medium hidden sm:inline">
                Overdue
              </span>
              <span className="text-xs font-medium sm:hidden">!</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-2 line-clamp-2 leading-tight">
          {task.title}
        </h4>

        {/* Due Date */}
        <div className="flex items-center space-x-1 mb-2 sm:mb-3">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span
            className={`text-xs ${
              overdue ? "text-red-600 font-medium" : "text-slate-500"
            }`}
          >
            {format(parseISO(task.dueDate), "MMM dd")}
          </span>
        </div>

        {/* Footer with Assignee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
              <AvatarImage
                src={task.assignee.avatar}
                alt={task.assignee.name}
              />
              <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                {task.assignee.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-slate-600 truncate max-w-[60px] sm:max-w-[100px]">
              {task.assignee.name.split(" ")[0]}
            </span>
          </div>

          {/* Task ID for reference */}
          <span className="text-xs text-slate-400 font-mono flex-shrink-0 ml-1">
            #{task.id.slice(-4)}
          </span>
        </div>
      </div>
    </div>
  );
};
