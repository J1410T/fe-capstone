import React from "react";
import { TaskStats } from "@/types/task";

interface TaskStatsBarProps {
  stats: TaskStats;
}

export const TaskStatsBar: React.FC<TaskStatsBarProps> = ({ stats }) => {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      color: "bg-slate-100 text-slate-700",
    },
    {
      label: "To Do",
      value: stats.toDo,
      color: "bg-slate-100 text-slate-700",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      color: "bg-red-100 text-red-700",
    },
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* Task Counts */}
      <div className="flex flex-wrap items-center gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">{item.label}:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Completion Rate */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-slate-600">Progress:</span>
        <div className="flex items-center space-x-2">
          <div className="w-24 bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                completionRate >= 80 
                  ? "bg-green-500" 
                  : completionRate >= 50 
                  ? "bg-blue-500" 
                  : "bg-slate-400"
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${
            completionRate >= 80 
              ? "text-green-600" 
              : completionRate >= 50 
              ? "text-blue-600" 
              : "text-slate-600"
          }`}>
            {completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
