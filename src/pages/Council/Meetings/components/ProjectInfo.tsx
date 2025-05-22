import React from "react";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectInfoProps {
  projectTitle: string;
  projectCode: string;
  type: string;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({
  projectTitle,
  projectCode,
  type,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Project:</span>
        <span className="text-sm text-muted-foreground">{projectTitle}</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Project Code:</span>
        <span className="text-sm text-muted-foreground">{projectCode}</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Type:</span>
        <Badge
          variant="outline"
          className={
            type === "Proposal"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-purple-100 text-purple-800 border-purple-200"
          }
        >
          {type}
        </Badge>
      </div>
    </div>
  );
};
