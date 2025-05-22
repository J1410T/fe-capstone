import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Project {
  id: number;
  title: string;
  field: string;
  status: string;
  createdAt: string;
  manager: string;
  budget: string;
  duration: string;
}

interface ProjectsListTabProps {
  projects: Project[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (projectId: number) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export const ProjectsListTab: React.FC<ProjectsListTabProps> = ({
  projects,
  searchTerm,
  onSearchChange,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>My Research Projects</CardTitle>
            <CardDescription>
              View and manage your registered research projects
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Project Title</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No projects found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.field}</TableCell>
                  <TableCell>{project.manager}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>{project.duration}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(project.status)}
                    >
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{project.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(project.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
