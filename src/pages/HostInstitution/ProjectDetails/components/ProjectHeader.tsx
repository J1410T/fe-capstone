import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusIcon } from "../utils/statusHelpers";

interface ProjectHeaderProps {
  title: string;
  status: string;
  pi: string;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  status,
  pi,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={getStatusColor(status)}>
            {getStatusIcon(status)}
            {status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Principal Investigator: {pi}
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={() => navigate("/host/my-projects")}>
        Back to My Projects
      </Button>
    </div>
  );
};
