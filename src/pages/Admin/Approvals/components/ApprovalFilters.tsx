import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

interface ApprovalFiltersProps {
  searchTerm: string;
  typeFilter?: string;
  priorityFilter?: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange?: (value: string) => void;
  onPriorityFilterChange?: (value: string) => void;
  onResetFilters: () => void;
  placeholder?: string;
  showTypeFilter?: boolean;
  showPriorityFilter?: boolean;
}

export const ApprovalFilters: React.FC<ApprovalFiltersProps> = ({
  searchTerm,
  typeFilter = "all",
  priorityFilter = "all",
  onSearchChange,
  onTypeFilterChange,
  onPriorityFilterChange,
  onResetFilters,
  placeholder = "Search approvals...",
  showTypeFilter = true,
  showPriorityFilter = true,
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${showTypeFilter || showPriorityFilter ? 'md:flex-row md:space-y-0 md:space-x-2' : ''}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {(showTypeFilter || showPriorityFilter) && (
        <div className="flex space-x-2">
          {showTypeFilter && onTypeFilterChange && (
            <Select
              value={typeFilter}
              onValueChange={onTypeFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Project Proposal">Project Proposal</SelectItem>
                <SelectItem value="Budget Request">Budget Request</SelectItem>
                <SelectItem value="BM05 Form">BM05 Form</SelectItem>
                <SelectItem value="BM06 Form">BM06 Form</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showPriorityFilter && onPriorityFilterChange && (
            <Select
              value={priorityFilter}
              onValueChange={onPriorityFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="icon" onClick={onResetFilters}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
