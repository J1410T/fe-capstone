import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  pi: string;
  department: string;
  status: string;
  progress: number;
}

interface RecentProjectsProps {
  projects: Project[];
  getStatusColor: (status: string) => string;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  projects,
  getStatusColor,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>
            Latest research projects at your institution
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/host/projects")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1 mb-2 md:mb-0">
                <h4 className="font-medium">{project.title}</h4>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {project.pi}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="mr-1 h-4 w-4" />
                    {project.department}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start md:self-center">
                <Badge
                  variant="outline"
                  className={getStatusColor(project.status)}
                >
                  {project.status}
                </Badge>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">
                  {project.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
