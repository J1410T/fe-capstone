import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { TaskStatus } from "@/types/task";

interface StatusFilterProps {
  value: TaskStatus | "All";
  onChange: (value: TaskStatus | "All") => void;
}

const statusOptions: (TaskStatus | "All")[] = ["All", "To Do", "In Progress", "Completed", "Overdue"];

const getStatusColor = (status: TaskStatus | "All") => {
  switch (status) {
    case "To Do":
      return "text-slate-600";
    case "In Progress":
      return "text-blue-600";
    case "Completed":
      return "text-green-600";
    case "Overdue":
      return "text-red-600";
    default:
      return "text-slate-600";
  }
};

export const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-300 focus:ring-blue-500 focus:border-blue-500">
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-2 text-slate-400" />
          <SelectValue placeholder="Filter by status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem key={status} value={status}>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                status === "To Do" ? "bg-slate-400" :
                status === "In Progress" ? "bg-blue-500" :
                status === "Completed" ? "bg-green-500" :
                status === "Overdue" ? "bg-red-500" :
                "bg-slate-300"
              }`} />
              <span className={getStatusColor(status)}>{status}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
