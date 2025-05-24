import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortAsc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProjectHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedField: string;
  onFieldChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
}

export const UserProjectHeader: React.FC<UserProjectHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedField,
  onFieldChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
        <p className="text-muted-foreground">
          Discover and explore research projects you're involved in
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects by name or description..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Research Field Filter */}
          <Select value={selectedField} onValueChange={onFieldChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Research Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="Environmental Science">Environmental Science</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Microbiology">Microbiology</SelectItem>
              <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
              <SelectItem value="Materials Science">Materials Science</SelectItem>
              <SelectItem value="Agricultural Science">Agricultural Science</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Medicine">Medicine</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="a-z">A - Z</SelectItem>
              <SelectItem value="z-a">Z - A</SelectItem>
              <SelectItem value="progress-high">Progress (High)</SelectItem>
              <SelectItem value="progress-low">Progress (Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
