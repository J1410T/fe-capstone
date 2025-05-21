import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  title: string;
  pi: string;
  department: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  budget: string;
  description: string;
}

interface ProjectOverviewProps {
  project: Project;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>
          Principal Investigator: {project.pi} | Department: {project.department}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {getStatusIcon(project.status)}
                <span className="ml-1">{project.status}</span>
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Timeline
              </p>
              <p className="text-sm">
                {project.startDate} to {project.endDate}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Budget
              </p>
              <p className="text-sm">{project.budget}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Progress
            </p>
            <div className="flex items-center gap-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{project.progress}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>
            <p className="text-sm">{project.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
