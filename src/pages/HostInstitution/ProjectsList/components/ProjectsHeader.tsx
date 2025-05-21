import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from "lucide-react";
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
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  onExportData: (format: string) => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedDepartment,
  onDepartmentChange,
  onExportData,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects List</h1>
        <p className="text-muted-foreground">
          View and manage all research projects at your institution
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
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Medicine">Medicine</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue="xlsx"
          onValueChange={(value) => onExportData(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <Download className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xlsx">Export as Excel</SelectItem>
            <SelectItem value="csv">Export as CSV</SelectItem>
            <SelectItem value="pdf">Export as PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
