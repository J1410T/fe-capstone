import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/types/task";
import { format, parseISO, isAfter, isValid } from "date-fns";
import { Calendar, AlertCircle } from "lucide-react";
import { MemberInfo } from "../MemberInfo";
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
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-blue-200",
        icon: "🟢",
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

const isValidDateString = (dateString: string): boolean => {
  if (!dateString || typeof dateString !== "string") return false;
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate);
  } catch {
    return false;
  }
};

const isOverdue = (dueDate: string, status: string): boolean => {
  if (status === "Completed" || status === "Complete") return false;
  if (!isValidDateString(dueDate)) return false;

  try {
    return isAfter(new Date(), parseISO(dueDate));
  } catch {
    return false;
  }
};

const formatDueDate = (dueDate: string): string => {
  if (!isValidDateString(dueDate)) {
    return "Invalid date";
  }

  try {
    return format(parseISO(dueDate), "MMM dd");
  } catch {
    return "Invalid date";
  }
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
  const formattedDueDate = formatDueDate(task.dueDate);
  const isDateValid = isValidDateString(task.dueDate);

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
            <span className={`text-sm font-semibold ${priorityConfig.color}`}>
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
              !isDateValid
                ? "text-slate-400 italic"
                : overdue
                ? "text-red-600 font-medium"
                : "text-slate-500"
            }`}
          >
            {formattedDueDate}
          </span>
        </div>

        {/* Footer with Assigned Members */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            {/* Display member-tasks if available */}
            {task["member-tasks"] && task["member-tasks"].length > 0 ? (
              <div className="flex items-center space-x-1">
                {/* Show up to 3 member avatars */}
                {task["member-tasks"].slice(0, 3).map((memberTask) => {
                  const memberData = memberTask.member;
                  const memberId = memberTask["member-id"];

                  if (memberData) {
                    // Use embedded member data
                    return (
                      <Avatar key={memberId} className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                        {memberData.avatarUrl ? (
                          <img
                            src={memberData.avatarUrl}
                            alt={memberData.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <AvatarFallback
                          className="text-xs bg-blue-100 text-blue-600"
                          style={{ display: memberData.avatarUrl ? 'none' : 'flex' }}
                        >
                          {memberData.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    );
                  } else {
                    // Fallback to MemberInfo component
                    return (
                      <MemberInfo
                        key={memberId}
                        memberId={memberId}
                        showRole={false}
                        size="sm"
                        className="min-w-0"
                      />
                    );
                  }
                })}

                {/* Show count if more than 3 members */}
                {task["member-tasks"].length > 3 && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-slate-600 font-medium">
                      +{task["member-tasks"].length - 3}
                    </span>
                  </div>
                )}

                {/* Show first member name if space allows */}
                {task["member-tasks"][0]?.member?.name && (
                  <span className="text-xs text-slate-600 truncate max-w-[60px] sm:max-w-[100px] hidden sm:inline">
                    {task["member-tasks"][0].member.name}
                  </span>
                )}
              </div>
            ) : task.assignee?.id ? (
              // Fallback to legacy assignee display
              <MemberInfo
                memberId={task.assignee.id}
                showRole={false}
                size="sm"
                className="min-w-0"
              />
            ) : (
              // No members assigned
              <>
                <Avatar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                    ?
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-slate-600 truncate max-w-[60px] sm:max-w-[100px]">
                  Unassigned
                </span>
              </>
            )}
          </div>

          {/* Task ID for reference */}
          {/* <span className="text-xs text-slate-400 font-mono flex-shrink-0 ml-1">
            #{task.id.slice(-4)}
          </span> */}
        </div>
      </div>
    </div>
  );
};
