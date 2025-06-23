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

interface ProjectsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedField: string;
  onFieldChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedField,
  onFieldChange,
  selectedSort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Projects</h1>
        <p className="text-muted-foreground">
          View all research projects available at your institution
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8 w-full md:w-[250px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {/* Research Field Filter */}
        <Select value={selectedField} onValueChange={onFieldChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="Environmental Science">
              Environmental Science
            </SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Microbiology">Microbiology</SelectItem>
            <SelectItem value="Artificial Intelligence">
              Artificial Intelligence
            </SelectItem>
            <SelectItem value="Materials Science">Materials Science</SelectItem>
            <SelectItem value="Agricultural Science">
              Agricultural Science
            </SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Medicine">Medicine</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
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
  );
};
